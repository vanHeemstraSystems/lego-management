function addComponent(state = { newNodes : [] }, action: any) {
    return Object.assign({}, state, { newNodes : [action.nodeName]});
}

export default addComponent