<template>
  <div class="login-page ">
    <div class="content">
        <h2>Login</h2>
        <form @submit.prevent="submit" class="form d-flex flex-column  mt-5">
            <input type="text" v-model="username" placeholder="username" class="form-control "/>
            <input :type="!visible? 'password': 'text'" v-model="password" placeholder="password" class="form-control my-4  "/>
            <label for="">
                <input type="checkbox" v-model="visible">
                show password
            </label>
            <div class="d-flex">
                <button class="bg-primary" :disabled="loading || !username || !password " type="submit">
                    <div class="spinner-border spinner-border-sm" role="status" v-if="loading"></div>
                    <span v-else>Login</span>
                </button>
                <button class="new btn text-primary" type="button">

                    <router-link to="/register">
                        register?
                    </router-link>
                 </button>
            </div>
        </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

import { useRouter } from 'vue-router'
import {  notification } from 'ant-design-vue';
export default {
    inject:[ "BASE_URL" ],  
    data(){
        return {
            username: "",
            password: "",
            visible: false,
            loading: false
        }
    },
    methods:{
        submit(event){
            this.loading =true
            axios.post(new URL("login/", this.BASE_URL).href, {
                username: this.username,
                password: this.password
            })
            .then(response => {
                const {data} = response
                if(data.error === 1){
                    this.openNotificationWithIcon("error", "Error!", data.message)
                }else{
                    localStorage.setItem("token", data.token)
                    this.openNotificationWithIcon("success", "Welcome!", data.message)
                    this.push("home")
                }
            })
            .catch(e=>{
                console.log(e)
                this.openNotificationWithIcon("error", "Server Problem!", "")
            })
            .finally(e=>{
                this.loading =false
            })
        }
    },
     setup(){
        const router = useRouter()
        const openNotificationWithIcon = (type, message, description) => {
			notification[type]({
				message,
				description,
			});
		};
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
.login-page{
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