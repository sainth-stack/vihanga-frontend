import { lazy } from "react"
  
class CodeSplitter {
  constructor(){
      this.components = {            
      }
  }

  addComponent(path,key){

      if(!this.components[key]){
          this.components[key] = lazy(() => import(`../../${path}`))
      }

  }

  getComponent (key){
      return this.components[key]
  }
}

export default new CodeSplitter()