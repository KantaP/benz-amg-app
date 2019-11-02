

class ToastRefService {
    toast = null
    set(ref) {
        // console.log('set ref ' , ref);
        this.toast = ref;
    }
    get() {
        // console.log('get toast' , this.toast);
        return this.toast;
    }
}

const toastRefService = new ToastRefService();


export default toastRefService;