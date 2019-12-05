<template>
    <div class="message">
        <TopBar/>
        <div class="list">
            <div class="list-header">
                <p>留言数：{{total}}</p>
                <div class="list-header-option">
                    <a @click="getMessageAsc">升序</a>|<a @click="getMessageDesc">降序</a>
                </div>
            </div>
            <div class="list-item" v-for="message in messages">
                <div class="list-item-content">
                    <div class="list-item-content-title">
                        <h2><Icon type="ios-contact" size="28"/>{{message.poster}}</h2>
                        <span>Email: {{message.mail}}</span>
                        <span>IP: {{message.ip}}</span>
                    </div>
                    <span>{{message.comment}}</span><br/>
                    <span style="font-size: 12px;color: gray">{{message.date}}</span>
                    <p v-if="message.reply" style="padding: 5px 10px">管理员回复：{{message.reply}}</p>
                </div>
                <div v-if="$store.state.user" class="list-item-action">

                    <Dropdown @on-click="dropDownClick($event,message)">
                        <Button type="primary" style="margin-right: 10px">Operate</Button>
                        <DropdownMenu slot="list" >
                            <DropdownItem name="reply" :disabled="message.reply?true:false">Reply</DropdownItem>
                            <DropdownItem name="edit">Edit</DropdownItem>
                        </DropdownMenu>

                    </Dropdown>
                    <Button type="error" @click="deleteComment(message.messageId)" >Delete</Button>
                </div>
            </div>
        </div>

        <Page class="page" :total="total" :page-size="pageSize" @on-change="onChange" />

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
        name: "Message",
        components: {TopBar},
        data(){
            return{
                replyModal:false,
                editModal:false,
                deleteModal:false,
                reply:'',
                pageNum:1,
                total:1,
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
            this.getMessages(1)
        },
        methods:{
            dropDownClick(name,message){
                console.log("name=>",name)
                console.log("message=>",message)
                if(name==="reply"){
                    this.replyComment(message.messageId)
                }else {
                    this.editComment(message.messageId,message.comment)
                }
            },
            messageInfo(message){
                return 'Poster:'+message.poster+'  Email:'+message.mail+"  IP:"+message.ip
            },
            //请求获取留言记录数据
            async getMessages(pageNum){
                const {pageSize,order} = this
                const result = await reqMessages({pageNum,pageSize,order},this)
                if(result.code===200){
                    //将获取得到的数据付给状态值
                    this.messages=result.data.messages
                    this.max = result.data.pageNums
                    this.total = result.data.total
                    console.log(this.messages)
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
                            this.getMessages(1)
                            this.$Message.success('Success!')
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
                this.getMessages(1)
            },
            onChange(page){
                this.getMessages(page)
            },
            getMessageAsc(){
                this.order="ASC"
                this.getMessages(1)
            },
            getMessageDesc(){
                this.order="DESC"
                this.getMessages(1)
            }
        }
    }
</script>

<style scoped lang="less">
    .page{
        width: 100%;
        text-align: center;
    }
    .list{
        color: black;
        padding: 59px 0px;
        .list-header{
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
        .list-item{
            padding: 0 10px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin: 10px 0;
            border-top: solid 1px lightgray;
            border-bottom: solid 1px lightgray;
            &:hover{
                transition: all 0.2s ease-in;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
            }
            .list-item-content{
                .list-item-content-title{
                    display: flex;
                    align-items: center;
                    span{
                        margin: 10px;
                    }
                }
            }
        }
    }
</style>