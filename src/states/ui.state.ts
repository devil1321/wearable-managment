interface UI_STATE_INTREFACE {
    ui:any;
    increment:() => any
    decrement:() => any
}

class UI_STATE implements UI_STATE_INTREFACE{
    public ui
    constructor(state:any){
        this.ui = state
    }
    increment(){
        this.ui.count = this.ui.count + 1
    }
    decrement(){
        this.ui.count = this.ui.count - 1
    }
}


const state = new UI_STATE({
    count:1
})

export default () => state