<template>
  <div class="register-page ">
    <div class="content">
        <h2>Register</h2>
        <form @submit.prevent="submit" class="form d-flex flex-column  mt-5">
            <input type="text" v-model="username" placeholder="username" class="form-control "/>
            <input type="text" v-model="email" placeholder="email" class="form-control mt-4"/>
            <input :type="!visible? 'password': 'text'" v-model="password" placeholder="password" class="form-control mt-4  "/>
            <input :type="!visible? 'password': 'text'" v-model="password2" placeholder="confirm password" class="form-control my-4  "/>
            <label for="">
                <input type="checkbox" v-model="visible">
                show password
            </label>
            
            <div class="d-flex">
                <button class="bg-primary" :disabled="loading || !username || !password || !password2" type="submit">
                    <div class="spinner-border spinner-border-sm" role="status" v-if="loading"></div>
                    <span v-else>Register</span>
                </button>
                <button class="new btn text-primary" type="button">

                    <router-link to="/login">
                        login?
                    </router-link>
                    </button>
            </div>
            
        </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import {  notification } from 'ant-design-vue';
import { useRouter } from 'vue-router'

export default {
    inject:[ "BASE_URL" ],  
    data(){
        return {
            username: "",
            email: "",
            password: "",
            password2: "",
            visible: false,
            loading: false
        }
    },
    methods:{
        submit(event){
            axios.post(new URL("register/", this.BASE_URL ).href, {
                username: this.username,
                password: this.password,
                password2: this.password2,
                email: this.email,


            })
            .then(response => {
                const {data} = response
                if(data.error === 1){
                    this.openNotificationWithIcon("error", "Error!", data.message)
                }else{
                    this.openNotificationWithIcon("success", "Success!", data.message)
                    this.push("login")
                }
            })
            .catch(e=>{
                console.log(e)
                this.openNotificationWithIcon("error", "Server Problem!", "")
            })
        }
    },
    setup(){
        const openNotificationWithIcon = (type, message, description) => {
            notification[type]({
                message,
				description,
			});
		};
        const router = useRouter()
        function push(path) {
            router.push({
                name: path,
            })
        }
        return {
            openNotificationWithIcon,
            push
        }
    }
}
</script>

<style scoped>
.register-page{
    width: 100%;
    height: 100%;
}
.content{ 
    width: clamp(340px, 80%, 600px);
    margin: 0 auto;
    border: 1px solid #ddd ;
    padding: 16px;
    border-radius: 12px;

}
button:first-of-type{
    flex-grow: 1;
}
button.new {
    width: 33%;
    min-width: unset;
}
</style>