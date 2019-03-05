import React, {Component} from 'react';
import * as THREE from 'three'
import * as TrackballControls from 'three-trackballcontrols';
import * as actions from '../../store/actions/index';
import Shell from '../../Components/Parts/Shell';
import Head from '../../Components/Parts/Head';
import Curve_nozzle from '../../Components/Parts/Curve_nozzle';
import Saddle from '../../Components/Parts/Saddle';
import Standard_nozzle from '../../Components/Parts/Standard_nozzle';
import math from 'mathjs';

import {connect} from 'react-redux';
class Scene extends Component {
    
  state = {
    current: {},
  };
    componentDidMount() {
      const width = window.innerWidth;
      const height = window.innerHeight;
  
      //ADD CAMERA
      this.scene = new THREE.Scene();
      this.camera = new THREE.PerspectiveCamera(
        75,
        width / height,
        0.1,
        1000
      );
      this.camera.position.z = 5;
            console.log("scene rendered completely");
      //ADD SCENE
  
      //ADD RENDERER
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(width, height);
      this.mount.appendChild(this.renderer.domElement);
      this.group = new THREE.Group();
       
      //ADD CUBE
  
      this.controls = new TrackballControls(this.camera, this.renderer.domElement);
  
      this.controls.rotateSpeed = 1.0;
      this.controls.zoomSpeed = 1.2;
      this.controls.panSpeed = 0.8;
      this.controls.noZoom = false;
      this.controls.noPan = false;
      this.controls.staticMoving = true;
      this.controls.dynamicDampingFactor = 0.3;
      this.controls.keys = [65, 83, 68];
  

      var ambient = new THREE.AmbientLight(0xbbbbbb);
      this.scene.add(ambient);
  
      var directionalLight = new THREE.DirectionalLight(0xffffff);
      directionalLight.position.set(0, 0, 1);
      this.scene.add(directionalLight);
      this.material = new THREE.MeshPhongMaterial({ color: '#0b7dba', emissive: 0x072534, side: THREE.DoubleSide });
      this.first=0;
      this.head_no=0;
      this.height_position=0;
      this.radial_position=0;
      // this.mesh= new THREE.Mesh();
      // this.mesh=Shell();
      // this.mesh.translateX(1.5);
      // this.scene.add(this.mesh);
      this.axesHelper = new THREE.AxesHelper( 5 );
      this.scene.add( this.axesHelper );
      //this.scene.add(this.mesh2);
      console.log("component",this.props.component);
 
      this.length=0;
      this.start();
    
    
    }

    
    componentWillReceiveProps(nextProps) {
    
  }
     

      
  
      componentWillUnmount() {
        this.stop();
        this.mount.removeChild(this.renderer.domElement);
      }
    
      start = () => {
        if (!this.frameId) {
          this.frameId = requestAnimationFrame(this.animate);
          this.controls.update();
          this.renderer.render(this.scene, this.camera);
        }
      }
    
      stop = () => {
        cancelAnimationFrame(this.frameId);
      }
    
      animate = () => {
        this.controls.update();
        this.renderScene();
        this.frameId = window.requestAnimationFrame(this.animate);
      }
    
      renderScene = () => {
        this.renderer.render(this.scene, this.camera);
      }
      render() {
        var scaler=0;
        //console.log("component",this.props.component);
        if(this.props.component.length>=0)
        {
          
          var rad=0;
          console.log("component",this.props.component);
          console.log("length",this.props.component.length);
        for (let i =0 ; i<this.props.component.length;i++)
        {
        
         console.log("component",this.props.component[i].component);
          
        if( this.props.component[i].length && this.props.component[i].component==="Cylinder"){
          console.log("title",this.props.component[i],i);
          var diameter=parseFloat(this.props.component[i].sd);
          this.length=parseFloat(this.props.component[i].length);
          var number=parseFloat(this.props.component[i].number);
          var thickness =parseFloat(this.props.component[i].thickness);
          this.scaler =diameter+thickness;
          console.log("scaler for cylinder",scaler);
             //for (let i = 0; i < number; i++) {
                var shell= new THREE.Mesh();
                console.log("thickness:",thickness, "diameter:",diameter,"length:",this.length,"number:",number);
                shell = Shell(thickness,diameter,this.length);
                console.log("before adddition of cylinder",this.height_position);
                if(this.first==1 || this.first==0){
                this.height_position=this.height_position+this.length/2;
                }
                else{
                  this.height_position=this.height_position+this.length;
                }
                console.log("position of cylinder",this.height_position);
                shell.translateY(this.height_position);//this.height_position);  
                //this.scene.add(shell);
              
                this.group.add(shell);
             // }    
              this.first=this.first+1;
              this.scene.add(this.group);
            //   this.start();
            // }
            this.props.component[i].length=0;
            this.radial_position=diameter/2+thickness;
            if(this.camera)
          {
          this.camera.position.z=(this.length+rad)*1.8;

          }
          }
          else if(this.props.component[i] && this.props.component[i].component==="Ellipsoidal Head" && this.props.component[i].MHT){
            var diameter=parseFloat(this.props.component[i].sd);
           var head_thickness= parseFloat(this.props.component[i].thickness);
           //var head_thickness= parseFloat(this.props.component[i].thickness);
           var head = new THREE.Mesh();

            
            var radius=diameter/2;
            var arc=1.1*(radius+head_thickness);
            var height_head=2*radius*math.pow(math.sin(arc/(2*radius)),2);
         


            rad=radius+head_thickness;
           // this.scaler=diameter+thickness;
          
            console.log("upper radius",rad);
            var alpha= (math.pi-1.1)/2;
            var chord= (rad)/math.sin(alpha);
            var r1=math.sqrt(chord*chord-rad*rad)
            var r2=rad/(math.tan(1.1));
            var new_radius=r1+r2;
            
            console.log("actual_radius",new_radius);
            
            if (this.head_no==0  && this.first==0)
            {
              head = Head(new_radius);
              head.rotateZ(3.14).translateY(-r2);
              this.scene.add(head);
              this.first=this.first+1;
              this.props.component[i].MHT=null;
              this.head_no=1;
         
            }
            else if (this.first!=0)
            {
              head=Head(new_radius);
              this.height_position=this.height_position-r2+this.length/2;
              head.translateY(this.height_position);
              this.scene.add(head);
              this.props.component[i].MHT=null;
              //head.translateY(this.height_position);
            }
            this.radial_position=rad;
            console.log("r1",r1);  
            if(this.camera)
            {
            this.camera.position.z=(this.length+rad)*1.8;
            }
          }
         else if(this.props.component[i]){
           
           if(this.props.component[i].component==="Nozzle" && this.props.component[i].type_name==="LWN"){
            var length=this.props.component[i].length;
            var orientation=this.props.component[i].orientation;            
            var orientation_in_rad=(orientation/180)*math.pi;
            var nozzle_height=this.props.component[i].height;
            var nozzle= new THREE.Mesh();
            console.log("normal scaler",scaler);
             nozzle=Standard_nozzle(length,this.scaler);
            // nozzle.scale.set(length,length,length);
             //nozzle.rotateY((orientation/180)*math.pi);
             nozzle.translateZ(-this.radial_position*math.cos(orientation_in_rad)).translateX(this.radial_position*math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
             console.log("nozzle",nozzle);
            this.scene.add(nozzle);
        
          }
          if(this.props.component[i].component==="Nozzle" && this.props.component[i].type_name==="HB"){
            var length=this.props.component[i].length;
            var orientation=this.props.component[i].orientation;            
            var orientation_in_rad=(orientation/180)*math.pi;
            var nozzle_height=this.props.component[i].height;
            var nozzle= new THREE.Mesh();
            console.log("curve scaler",this.scaler);
             nozzle=Curve_nozzle(length,this.scaler);
            // nozzle.translateY(4);
            nozzle.translateZ(-this.radial_position*math.cos(orientation_in_rad)).translateX(this.radial_position*math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
             console.log("nozzle",nozzle);
            this.scene.add(nozzle);
           
          
          }
          if(this.camera)
          {
            this.camera.position.z=(this.length+rad)*1.8;
            }
        
      }

          
          this.start();
          }
          
        }
        //console.log(this.props.component);
        return ( <div
          style={{ width: '100%', height: '700px' }}
          ref={(mount) => { this.mount = mount }}
        />
        );
      }

    }

    const mapStateToProps = state => {
      return {
          component: state.componentData.component,
          title: state.navigation.title
      };
  };
  
  // const mapDispatchToProps = dispatch => {
  //     return {
  //         onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
  //         onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
  //     };
  // };

  
export default connect(mapStateToProps, null)(Scene);