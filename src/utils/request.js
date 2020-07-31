import axios from 'axios';
let service=axios.create({
    baseURL: process.env.API_ROOT, // api 的 base_url    process.env.API_ROOT
    timeout: 5000, // request timeout

})
//request interceptor 对请求进行拦截
service.interceptors.request.use(
    config => {
    //做一些事情拦截
        return config
    },
    error => {
        Promise.reject(error)
    }
)
// response interceptor 对响应进行拦截
service.interceptors.response.use(
    response =>{
        return response
    },
    error => {
        return Promise.reject(error)
    }
)
export default service