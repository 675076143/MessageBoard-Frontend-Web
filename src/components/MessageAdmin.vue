<template>
    <div class="message-admin">
        <TopBar/>
        <List class="message-list" item-layout="vertical">
            <ListItem v-for="message in messages">
                <ListItemMeta :avatar="userImg" :title="message.poster" :description="message.comment" />
                <p v-if="message.reply">管理员回复：{{message.reply}}</p>
                <template slot="action">
                    <li>
                        <a :disabled="message.reply" @click="replyComment(message.messageId)">Reply</a>
                    </li>
                    <li>
                        <a @click="editComment(message.messageId,message.comment)">Edit</a>
                    </li>
                    <li>
                        <a @click="deleteComment(message.messageId)">Delete</a>
                    </li>
                </template>
            </ListItem>
        </List>
        <Page class="page" :total="100" :page-size="5" />

        <Modal v-model="replyModal" width="360">
            <p slot="header" style="text-align:center">
                Reply this comment
            </p>
            <div style="text-align:center">
                <Form ref="formReply" :model="formReply" :rules="ruleReply" :label-width="80">
                    <FormItem label="reply" prop="reply">
                        <Input v-model="formReply.reply" placeholder="Enter your reply" type="textarea" :rows="4"></Input>
                    </FormItem>
                </Form>

            </div>
            <div slot="footer">
                <Button type="info" size="large" long @click="sendReply('formReply')">Reply</Button>
            </div>
        </Modal>

        <Modal v-model="deleteModal" width="360">
            <p slot="header" style="color:#f60;text-align:center">
                <Icon type="ios-information-circle"></Icon>
                <span>Delete confirmation</span>
            </p>
            <div style="text-align:center">
                <p>Will you delete it?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long  @click="deleteConfirm">Delete</Button>
            </div>
        </Modal>

        <Modal v-model="editModal" width="360">
            <p slot="header" style="text-align:center">
                Reply this comment
            </p>
            <div style="text-align:center">
                <Form ref="formEdit" :model="formEdit"  :label-width="50">
                    <FormItem label="reply" prop="reply">
                        <Input v-model="formEdit.messageId" disabled></Input>
                    </FormItem>
                    <FormItem label="reply" prop="reply">
                        <Input v-model="formEdit.comment" placeholder="Enter your comment" type="textarea" :rows="5" ></Input>
                    </FormItem>
                </Form>

            </div>
            <div slot="footer">
                <Button type="info" size="large" long @click="sendEdit('formEdit')">Edit</Button>
            </div>
        </Modal>




    </div>
</template>

<script>
    import userImg from "../assets/user_48px.png";
    import {reqDeleteMessage, reqEditMessage, reqMessages, reqReply, reqSendMessage} from "../api";
    import TopBar from "./TopBar";

    export default {
        name: "MessageAdmin",
        components: {TopBar},
        data(){
            return{
                replyModal:false,
                editModal:false,
                deleteModal:false,
                reply:'',
                pageNum:1,
                max:10,
                min:1,
                messages:[],
                order:"ASC",
                pageSize:5,
                userImg,
                modal:false,
                formReply: {
                    messageId:0,
                    reply:''
                },
                ruleReply: {
                    reply: [
                        { required: true, message: 'The comment cannot be empty', trigger: 'change' }
                    ]
                },
                formEdit:{
                    messageId:0,
                    comment:''
                }
            }
        },
        async mounted() {
            const {pageNum,pageSize,order} = this
            //请求数据
            this.getMessages()
        },
        methods:{
            //请求获取留言记录数据
            async getMessages(){
                const {pageNum,pageSize,order} = this
                const result = await reqMessages({pageNum,pageSize,order},this)
                if(result.code===200){
                    //将获取得到的数据付给状态值
                    this.messages=result.data.messages
                    this.max = result.data.pageNums
                    console.log(this.messages)
                }
            },
            //前一页
            async frontPage(){
                console.log("click")
                console.log(this.max)
                if(this.pageNum<this.max){
                    this.pageNum++
                    this.getMessages()
                }

            },
            //后一页
            backPage(){
                if(this.pageNum>this.min){
                    this.pageNum--
                    this.getMessages()
                }

            },
            replyComment(messageId){
                this.replyModal = true
                this.formReply.messageId = messageId
            },
            //发送回复
            sendReply(name){
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        const {messageId,reply} = this.formReply
                        const result = await reqReply({messageId,reply},this)
                        if(result.code===200){
                            this.replyModal=false
                            this.formReply.messageId=0
                            this.formReply.reply=""
                            this.getMessages()
                            this.$Message.success('Success!');
                        }else {
                            this.$Message.error("failed!")
                        }

                    } else {
                        // this.$Message.error('Fail!');
                        // this.modal = true
                    }
                })
            },
            //删除回复
            deleteComment(messageId){
                this.deleteModal = true
                this.formReply.messageId = messageId
            },
            //确认执行删除
            async deleteConfirm(){
                const {messageId} = this.formReply
                const result = await reqDeleteMessage({messageId},this)
                if(result.code===200){
                    this.deleteModal=false
                    this.formReply.messageId=0
                    this.formReply.reply=""
                    this.getMessages()
                    this.$Message.success('Success!');
                }else {
                    this.$Message.error("failed!")
                }
            },
            editComment(messageId,comment){
                this.editModal = true
                this.formEdit.messageId = messageId
                this.formEdit.comment = comment
            },
            async sendEdit(name){
                const {messageId,comment} = this.formEdit
                const result = await reqEditMessage(messageId,comment,this)
                if(result.code === 200){
                    this.$Message.success("success!")
                }else {
                    this.$Message.error("failed!")
                }
                this.editModal = false
                this.formEdit.messageId = 0
                this.formEdit.comment = ""
                this.getMessages()
            }
        }
    }
</script>

<style scoped lang="less">
    .btn-page{
        position: fixed;
        bottom: 0;
        width: 100%;
        height: 40px;
        display: flex;

        .front-page,.back-page,pageNum{
            flex: 1;
            height: 100%;
        }
    }
    .message-list{
        padding: 5%;
    }
</style>