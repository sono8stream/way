const projects = (state = {noData: true}, action) => {
  switch (action.type) {
    case 'RECEIVE_PROJECTS_DATA':
      let projects ={}
      if(action.data){
        Object.keys(action.data).forEach(key =>{
          let members = []
          Object.keys(action.data[key].members).forEach(userkey =>{
            members.push({userkey})
          });
          projects[key]={
            members: members,
            name: action.data[key].name,
            description: action.data[key].description,
          }
        });
      }
      return projects
    case 'RECEIVE_PROJECTS_ERROR':
    case 'UPDATE_PROJECTS_ERROR':
      // alert(action.message)
      return state
    default:
      return state
  }
}

export default projects
