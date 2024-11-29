import axios, { HttpStatusCode } from 'axios';

const instance = axios.create();

// 요청 인터셉터
instance.interceptors.request.use(function (config) {
    // 스토리지에서 토큰을 가져온다. 
    const accessToken = localStorage.getItem('access_token');

    // 토큰이 있으면 요청 헤더에 추가한다. 
    if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
    }

    return config;
}, function (error) {
    // 요청 오류 처리
    console.log("[axios-interceptor] > " + error)
    return Promise.reject(error);
});

// 응답 인터셉터
instance.interceptors.response.use(async function (response) {
    return response;
}, async function (error) {
    const { config, response: { status } } = error;

    if (status === HttpStatusCode.Unauthorized) {
        // 토큰이 없거나 잘못되었을 경우
        // alert('로그인 정보를 찾을 수 없습니다. 로그인해 주세요.')
    }

    return Promise.reject(error);
});

export default instance;