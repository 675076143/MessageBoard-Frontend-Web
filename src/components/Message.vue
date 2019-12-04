<template>
    <div class="message">
        <List class="message-list">
            <ListItem v-for="message in messages">
                <ListItemMeta :avatar="userImg" :title="message.poster" :description="message.comment" />
            </ListItem>
        </List>

        <ButtonGroup class="btn-page">
            <Button class="back-page" @click="backPage" >
                <Icon type="ios-arrow-back"></Icon>
                Backward
            </Button>
            <InputNumber :max="max" :min="min" v-model="pageNum" class="pageNum" size="large" readonly></InputNumber>
            <Button class="front-page" @click="frontPage">
                Forward
                <Icon type="ios-arrow-forward"></Icon>
            </Button>
        </ButtonGroup>
        <Button shape="circle" type="info" class="btn-message" @click="editMessage"><Icon type="md-brush" /></Button>
        <Modal
                v-model="modal"
                title="Leave your comments"
                @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="Name" prop="poster">
                    <Input v-model="formValidate.poster" placeholder="Enter your name"></Input>
                </FormItem>
                <FormItem label="E-mail" prop="mail">
                    <Input v-model="formValidate.mail" placeholder="Enter your e-mail"></Input>
                </FormItem>
                <FormItem label="Comment" prop="comment">
                    <Input v-model="formValidate.comment" placeholder="Enter your comment"
                           type="textarea" :rows="4"></Input>
                </FormItem>

            </Form>
            <div slot="footer">
                <Button type="info" size="large" long @click="ok('formValidate')">Send Message</Button>
            </div>
        </Modal>
    </div>
</template>

<script>
    import {reqMessages, reqSendMessage} from "../api";
    import userImg from "../assets/user_48px.png"
    export default {
        name: "Message",
        data(){
            return{
                pageNum:1,
                max:10,
                min:1,
                messages:[],
                order:"ASC",
                pageSize:5,
                userImg,
                modal:false,
                formValidate: {
                    poster: '',
                    mail: '',
                    comment:''
                },
                ruleValidate: {
                    poster: [
                        { required: true, message: 'The name cannot be empty', trigger: 'blur' }
                    ],
                    mail: [
                        { required: true, message: 'Mailbox cannot be empty', trigger: 'blur' },
                        { type: 'email', message: 'Incorrect email format', trigger: 'blur' }
                    ],
                    comment: [
                        { required: true, message: 'The comment cannot be empty', trigger: 'change' }
                    ]
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
            //编辑留言
            editMessage(){
                this.modal=true
            },
            //发送留言
            ok (name) {
                //表单验证
                this.$refs[name].validate(async (valid) => {
                    if (valid) {
                        const {poster,mail,comment} = this.formValidate
                        const result = await reqSendMessage({poster,mail,comment},this)
                        this.$Message.success('Success!');
                        this.modal=false
                        this.formValidate.poster=""
                        this.formValidate.mail=""
                        this.formValidate.comment=""
                        this.getMessages()
                    } else {
                        // this.$Message.error('Fail!');
                        // this.modal = true
                    }
                })

            },
            cancel () {
                // this.$Message.info('Clicked cancel');
                // this.modal=true
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
.btn-message{
    height: 49px;
    width: 49px;
    position: fixed;
    bottom: 55px;
    right: 10px;
}
.message-list{
    padding: 5%;
}
</style>