import React, {
  Component
} from 'react';
import * as THREE from 'three'
// import * as TrackballControls from 'three-trackballcontrols';
import * as actions from '../../store/actions/index';
import cylinderRenderer from '../../Components/Renderers/cylinderRenderer';
import ellipseRenderer from '../../Components/Renderers/ellipseRenderer';
import nozzleRenderer from '../../Components/Renderers/nozzleRenderer';
import saddleRenderer from '../../Components/Renderers/saddleRenderer';
import isEmpty from '../../Components/Scene/object_empty';
import OrbitControls from 'three-orbitcontrols';
import {
  connect
} from 'react-redux';
import liftingLugHoriRenderer from '../../Components/Renderers/liftingLugHoriRenderer';
import liftingLugCreatorHori from '../../Components/Renderers/liftingLugCreatorHori';
import Sprite from 'three.textsprite';


let inset={
  width: '105px',
    height: '105px',
    position:'absolute',
    bottom:'0px',
    /* or transparent; will show through only if renderer alpha: true */
    margin: '5px',
 
}
let vessel_type={
  width: '75px',
    height: '75px',
    position:'absolute',
    top:'65px',
    right:'40px',
    /* or transparent; will show through only if renderer alpha: true */
    margin: '5px',
 
}
class Scene_horizontal extends Component {
  state = {
    current: {},
  };
  componentDidMount() {
    let rect = document.getElementById("scener").getBoundingClientRect();

    const width = window.innerWidth-rect.x;
    const height = window.innerHeight-rect.y;
    //ADD CAMERA
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0x696969 );
    // this.camera = new THREE.PerspectiveCamera(
    //   75,
    //   width / height,
    //   0.1,
    //   1000
    // );
    this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );

    this.camera.position.z = 10;
    this.camera.zoom=100;// needs zooming as object is not viewed from this camera distance
    this.camera.updateProjectionMatrix();
    //ADD SCENE
    //ADD RENDERER
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.mount.appendChild(this.renderer.domElement);
    document.getElementById("scener").addEventListener('mouseup', this.onDocumentMouseDown, false);
    this.group = new THREE.Group();
    //ADD CUBE
    // this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    this.controlSetup();
    this.shapes = [];
    let ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);
    window.addEventListener('resize', this.onWindowResize, false);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(0, 0, 1000);
    this.scene.add(directionalLight);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 0, -1000);
    this.scene.add(directionalLight2);

    this.material = new THREE.MeshPhongMaterial({
      color: '#0b7dba',
      emissive: 0x072534,
    });

    let container2 = document.getElementById("inset");

    // renderer
    this.renderer2 = new THREE.WebGLRenderer();
    // this.scene.position.set(-3,0,0);
    this.renderer2.setClearColor( 0xfffaaa,0);
    this.renderer2.setSize( 105, 105 );
    container2.appendChild(this.renderer2.domElement);
    
    // scene
    this.scene2 = new THREE.Scene();
    
    // camera
    this.camera2 = new THREE.PerspectiveCamera( 50,105 / 105, 1, 1000 );
    this.camera2.up = this.camera.up; // important!
    
    // axes
    this.axes2 = new THREE.AxisHelper( 100 );
    this.scene2.add(this.axes2);
    
    this.sprite = new Sprite({
      textSize: 0.1,
      texture: {
          text: 'Horizontal',
          fontFamily: 'Arial, Helvetica, sans-serif',
      },
      material: {color: 0xffffff},
    });
    
    let container3= document.getElementById("vessel_type");
    this.renderer3 = new THREE.WebGLRenderer();
    this.renderer3.setClearColor(0xfffaaa,0);
    this.renderer3.setSize(75,75);
    
    container3.appendChild(this.renderer3.domElement);
    this.scene3=new THREE.Scene();
    //renderer
    this.scene3.background = new THREE.Color(0x696969);
    this.camera3 = new THREE.PerspectiveCamera( 5,105 / 105, 1, 1000 );
    this.camera3.up = this.camera.up; // important!
    this.scene3.add(this.sprite);
    


    this.head_no = 0;
    this.radial_position = 0;
    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
    this.shell_diameter = 0;
    this.length = 0;
    this.heights = {};
    this.weights = {};
    this.weight_permanent={};
    this.name=null;
    this.compID=null;
    this.heights_only = [];
    this.heights_only_lug = [];
    this.controls.update();
    this.start();
  }
  onDocumentMouseDown = (event) => {  
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    let rect = document.getElementById("scener").getBoundingClientRect();
    mouse.x = (event.clientX - rect.x) / (window.innerWidth-rect.x) * 2 - 1;
    mouse.y = -((event.clientY - rect.y) / (window.innerHeight-rect.y))* 2 + 1;
    raycaster.setFromCamera( mouse, this.camera );
    if (this.shapes.length >= 1) {
     // let intersects = raycaster.intersectObjects(this.shapes, true);
    var intersects = raycaster.intersectObjects( this.shapes, true);
      if (intersects.length > 0) {
       // console.log("intersect",intersects);
        intersects[0].object.material.transparent = true;
        try {
          const sh = [...this.shapes];
          sh.map((shape) => {
            let sh_name = shape.name.split("&");
            if (sh_name[1] === "Cylinder" || sh_name[1] === "Conical") {
              shape.material.opacity = 1;
            } else {
              shape.children.map((child) => {
                child.material.opacity = 1;
                return 0;
              })
            }
            return 0;
          });
        } catch (e) {
          console.log(e)
        }
        if (intersects[0].object.material.opacity === 0.5) {
          
          intersects[0].object.material.opacity = 1;
        } else {
          intersects[0].object.material.opacity = 0.5;
        }
 
        let name=null;
        if(intersects[0].object.parent.name)
        {
          name=intersects[0].object.parent.name;
        }
        else{            
          name=intersects[0].object.name;
        }
        let res=null;
        if(name){
        res=name.split("&");
        this.name = res[1];
        this.compoID=res[0];
        this.props.updateSelectedComponentID(parseInt(res[0]));
        this.props.treeUpdate(false);
        this.props.modelImport(res[1],1);
        this.props.returnComponentID(parseInt(res[0]));
        this.props.componentClicked(true);
        }
        else{
          res=[-1,"noComponent"]
        }
      }
      else {
        this.props.displayComponentTree(true);
      }
    }
    this.controls.update();
  }
  onWindowResize = () => {
    let left = document.getElementById("scener").getBoundingClientRect();
    console.log("onresize",left)
    this.camera.aspect = (window.innerWidth-left.x) / (window.innerHeight-left.y);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize((window.innerWidth-left.x), (window.innerHeight-left.y));
  }

  componentWillReceiveProps(nextProps) {

  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.view !== this.props.view) {
      this.controls.reset();
    switch (this.props.view){
      case "SIDE":
        this.camera.position.set(10, 0, 0);
        break;
      case "FRONT":
        this.camera.position.set(0, 0, 10);
        break;
      case "TOP":
        this.camera.position.set(0.0001, 10, 0);
        break;
      default:
        break;
      
    }
    this.camera.zoom=100;// needs zooming as object is not viewed from this camera distance
    this.camera.updateProjectionMatrix();
    this.controlSetup();
    this.controls.update();
  }
  }

  clearScene = () => {
    for (let i = this.scene.children.length - 1; i >= 0; i--) {
      const object = this.scene.children[i];
      if (object.type === "Mesh" || object.type === "Group") {
        this.scene.remove(object);
      }
    }
  }

  start = () => {
    if (!this.frameId) {
      this.frameId = requestAnimationFrame(this.animate);
      this.controls.update();
      this.renderer.render(this.scene, this.camera);
      this.renderer2.render(this.scene2,this.camera2);
      this.renderer3.render(this.scene3,this.camera3);
    }
  }

  stop = () => {
    cancelAnimationFrame(this.frameId);
  }

  animate = () => {
    this.frameId = window.requestAnimationFrame(this.animate);

    this.controls.update();

    this.camera2.position.copy( this.camera.position );
    this.camera2.position.sub( this.controls.target ); // added by @libe
    this.camera2.position.setLength(300);
  
    this.camera2.lookAt( this.scene2.position );
    this.camera3.position.copy( this.camera.position );
    this.camera3.position.sub( this.controls.target ); // added by @libe
    this.camera3.position.setLength(5);
    this.camera3.lookAt( this.scene3.position );
    this.renderScene();
 
  }

  return_children = (object) => {
    return object.children;
  }


  renderScene = () => {
    this.renderer.render(this.scene, this.camera);
    this.renderer2.render(this.scene2,this.camera2);
    this.renderer3.render(this.scene3,this.camera3);
  }
  render() {
    try {
      let scaler=100;
      this.shapes = [];
      let first_shell = true;
      let height_position = 0;
      this.heights = {};
      this.weights = {};
      let cylinder_iterator = 0;
      let cylinder_lengths = [];
      let last_cylinder = null;
      let lug_index, lug_angle;
      let lug_name;
      let t={  color: '#037d23',
      emissive: 0x072534,
      side: THREE.DoubleSide,
      transparent:true,
      opacity:1,
      shininess:100
    };
    let lug1=null;
    let lug2 = null;
    let distance1=0,distance2=0;
      if (this.scene) {
        if (this.scene.children) {
          this.clearScene();
        }
      }
      if (this.props.component.length >= 0 && this.scene) {
        for (let i = 0; i < this.props.component.length; i++) {

          if(!isEmpty(this.props.component[i]))
          {
            if(this.name===this.props.component[i].component.toString() && this.compoID===this.props.component[i].componentID.toString()){
              t.opacity=0.5;
            }
            else{
              t.opacity=1;
            }
            switch (this.props.component[i].component)
            {
              case "Cylinder":
              case "Conical":
            {
              let values = cylinderRenderer(this.props.component[i], 
                                            this.heights,
                                            this.weights,
                                            scaler,
                                            t,
                                            first_shell,
                                            height_position,
                                            cylinder_iterator,
                                            cylinder_lengths,
                                            "horizontal");
              first_shell=values[2];
              height_position=values[3];
              let shell= values[5]
              let ringgeometry=values[4]
              this.heights=values[6]
              this.weights=values[7]
              if(ringgeometry)
              {
              this.scene.add(ringgeometry)
              }
              cylinder_iterator = cylinder_iterator + 1;
              this.radial_position = values[0] / 2 + values[1]; 
              if(shell)
              {
              this.scene.add(shell)
              shell.name = values[9]+ "&" + values[8];
              this.shapes.push(shell);  
              }       
              last_cylinder = i;
            break;}        
              case "Ellipsoidal Head":
          {
              let values =ellipseRenderer(this.props.component,
                                          this.props.component[i],
                                          this.heights,
                                          this.weights,
                                          scaler,t,
                                          "horizontal") ;
              let ell=values[0];
              ell.name=values[4] + "&" + values[3];
              this.shapes.push(ell);
              this.scene.add(ell);
              this.heights=values[1];
              this.weights=values[2];
              break;
          } 
          case "Nozzle":
          {
           if( this.props.component[i].type_name === "LWN") 
          {
              let values=nozzleRenderer(this.props.component,
                this.props.component[i],
                scaler,
                t,
                this.heights,
                this.weights,
                this.heights_only,
                "horizontal");         
            let nozzle =values[0];       
            this.heights=values[1];       
            this.weights=values[2];  
            nozzle.name=values[5]+"&"+values[4]; 
            this.shapes.push(nozzle);
            this.scene.add(nozzle);
          } else if (this.props.component[i].type_name === "HB") 
          {

            // let length = this.props.component[i].length * (12/scaler);
            // let orientation = this.props.component[i].orientation;
            // let orientation_in_rad = (orientation / 180) * math.pi;
            // let nozzle_height = this.props.component[i].height/scaler;
            // let nozzle = new THREE.Mesh();
            // nozzle = Curve_nozzle(length, 1);
            // nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
            // nozzle.name=this.props.component[i].componentID+ "&"+this.props.component[i].component;
            // this.scene.add(nozzle);
            // this.shapes.push(nozzle);
            // this.keepHeightRecord(this.props.component[i],-500,0);

          }
          break;
        }
          case  "Skirt":
          break;
          
          case "Lifting Lug": {
            let values=liftingLugCreatorHori(this.props.component[i],this.weights,scaler,t);
            lug1=values[0];
            console.log("lugger lug",lug1)
            lug2=values[1];
            lug_index=values[2];
            lug_name=values[6]+"&"+values[5];
            distance1=values[3];
            distance2=values[4];
            lug_angle=values[7];
            break;
          } case "Saddle": 
          {
            let values =saddleRenderer(this.props.component[i],this.props.component,scaler,t,last_cylinder);
            let saddle =values[0];
            saddle.name=values[2]+"&"+values[1];
            this.scene.add(saddle);
            this.shapes.push(saddle);
          break;
          }
          default: break;
        }
        if(lug1 && i===(this.props.component.length-1))
    {
         let values= liftingLugHoriRenderer(lug1,lug2,this.props.component,this.heights,this.weights,this.heights_only_lug,distance1,distance2,lug_angle,scaler,lug_index);
         lug1=values[0];
         lug2=values[1];
        this.heights=values[2];
        this.weights=values[3];
        this.heights_only_lug=values[4];
        console.log("lug",lug1)
        lug1.name=lug_name;
        this.scene.add(lug1);
        this.shapes.push(lug1);
        if(lug2)
        {
          lug2.name=lug_name;
          this.scene.add(lug2);
          this.shapes.push(lug2);
        }
        
    }
      }
    }}
      return ( <div>< div width = '100%'
        height = '100%'

        ref = {
          (mount) => {
            this.mount = mount
          }
        }
        id = "scener" />
        <div id="inset" style={inset} />
        <div id="vessel_type" style={vessel_type} />

        </div>
      );
    } catch (err) {
      console.log(err);
    } finally{
      console.log("finally");
    }
  }

  controlSetup=()=>
  {
    this.controls.rotateSpeed = 2.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 1;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;
  }
}


const mapStateToProps = state => {
  return {
    component: state.components.component,
    title: state.navigation.title,
    view:state.componentData.view
  };
};

// const mapDispatchToProps = dispatch => {
//     return {
//         onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
//         onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
//     };
// };



const mapDispatchToProps = dispatch => {
  return {
    updateSelectedComponentID: (id) => {
      dispatch(actions.updateSelectedComponentID(id));
    },
    onDataUpdate: (data, componentID, height) => {
      dispatch(actions.updateHeight(data, componentID, height))
    },
    treeUpdate: (value) => {
      dispatch(actions.displayComponentTree(value))
    },
    modelImport: (titleName, value) => {
      dispatch(actions.importComponentModel(titleName, value))
    },
    returnComponentID: (id) => {
      dispatch(actions.returnComponentByID(id))
    },
    componentClicked: (value) => {
      dispatch(actions.componentClicked(value))
    },
    onupdateSelectedComponentID: (id) => {
      dispatch(id)
    },
    displayComponentTree: value =>
    dispatch(actions.displayComponentTree(value))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Scene_horizontal);