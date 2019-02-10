import Vue from 'vue';
import Router from 'vue-router';
import Main from '@/components/page/Main';
import Error from '@/components/Error';

Vue.use(Router);

export default new Router({
    // mode: 'history',
    routes:[
        {
            path: '/',
            name: 'main',
            component: Main
        },
        {
            path: '*',
            name: 'error',
            component: Error
        }
    ]
});