    import React,{Component} from 'react';
import Aux from '../../../hoc/Auxx/Auxx';
import FormInput from './formInput';
import axios from "../../../axios-orders";

class Support extends Component{
    state={
        app:"Vessel Express",
        need:"",
        subject:"",
        description:"",
        pic:""
    }
    uploadAttachment=(e)=>
{
    let file = e.target.files[0];
    // let reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload=(e)=>{
      this.setState({pic: file});
    //}
}

formSubmit = (e) => {
    e.preventDefault()
    const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: "JWT " + localStorage.getItem("token")
      };
    if(this.state.subject && this.state.description)
    {
      this.props.backDropOff();
   
  
    let data = new FormData();
        data.append("app",this.state.app);
        data.append("subject",this.state.subject);
        data.append("description",this.state.description);
        data.append("pic",this.state.pic)
    console.log("sending data",data)
    axios.post('/ticketing/',data,{ headers: headers })
    .then( res => {

    })
    .catch( () => {

      
    })
}
  }
  
    //pic, app, description, subject, need
 render(){
    let apps=["Vessel Express"];

    return(
        <Aux>
            <div>
            <form>
            <FormInput inputType="select" name="App Name" option={apps} />
            <FormInput inputType="input" formControl ="form-control" type="text" label="Subject" onChange={e => this.setState({subject: e.target.value})} placeholder="Subject"/>
            <FormInput inputType="textarea" formControl="form-control" type="text" label="Description" onChange={e => this.setState({ description: e.target.value})} placeholder="Description" />
            <FormInput inputType="input" formControl="form-control-file" type= "file" label="Attachment" placeholder="Attachment"  uploadAttachment={this.uploadAttachment}/>
  <button type="submit" className="btn btn-primary" onClick={this.formSubmit}>Submit</button>
  <small style={{color:"red",padding:"10px"}}>Subject and Description are necessary</small>
</form>
                 
            </div>
        </Aux>

    )
 }
}


export default Support;