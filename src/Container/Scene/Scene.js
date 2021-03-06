import React, {
  Component
} from 'react';
import * as THREE from 'three';
import * as actions from '../../store/actions/index';
import isEmpty from '../../Components/Scene/object_empty';
import cylinderRenderer from '../../Components/Renderers/cylinderRenderer';
import nozzleRenderer from '../../Components/Renderers/nozzleRenderer';
import liftingLugRenderer from '../../Components/Renderers/liftingLugRenderer';
import ellipseRenderer from '../../Components/Renderers/ellipseRenderer';
// import skirtRenderer from '../../Components/Renderers/skirtRenderer';
import skirtRenderer2 from '../../Components/Renderers/skirtRenderer2';
import OrbitControls from 'three-orbitcontrols';
import Sprite from 'three.textsprite';

import {
  connect
} from 'react-redux';

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
    top:'50px',
    right:'2px',
    /* or transparent; will show through only if renderer alpha: true */
    margin: '2px',
}
class Scene extends Component {
  state = {
    current: {},
  };
 
  componentDidMount() {
    let left = document.getElementById("scener").getBoundingClientRect();
    const width = window.innerWidth-left.x;
    const height = window.innerHeight-left.y;
    this.scene = new THREE.Scene();
    let col='#e4f4f7';
    this.scene.background = new THREE.Color(col);
    // this.camera = new THREE.PerspectiveCamera(
    //   90,
    //   width / height,
    //   0.001,1000000
    // );
    this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 0.1, 1000 );
    // this.camera = new THREE.OrthographicCamera( width / - 2, width / 2, height / 2, height / - 2, 1, 1000 );
    // this.scene.add(this.camera);
    this.camera.position.set(10,10,10); //Camera needs to be somewhat far, otherwise the object will be clipped 
    this.camera.zoom=100;// needs zooming as object is not viewed from this camera distance
    this.camera.updateProjectionMatrix(); //update projection matrix
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.mount.appendChild(this.renderer.domElement);
    this.group = new THREE.Group();

    document.getElementById("scener").addEventListener('mouseup', this.onDocumentMouseDown, false);
//     let squareWorker = new Worker("code/squareworker.js");
//     addEventListener("message", event => {
//       postMessage(event.data * event.data);
//     });

// squareWorker.addEventListener("message", event => {
//   console.log("The worker responded:", event.data);
// });
// squareWorker.postMessage(10);
// squareWorker.postMessage(24);

let container2 = document.getElementById("inset");
this.renderer2 = new THREE.WebGLRenderer({ alpha: true });
// this.scene.position.set(-3,0,0);
this.renderer2.setClearColor( 0x000000, 0);
this.renderer2.setSize( 105, 105 );
container2.appendChild(this.renderer2.domElement);
this.scene2 = new THREE.Scene();
// this.scene2.background = new THREE.Color(col);

// camera
this.camera2 = new THREE.PerspectiveCamera( 50,105 / 105, 1, 1000 );
this.camera2.up = this.camera.up; // important!

// axes
this.axes2 = new THREE.AxisHelper( 100 );
this.scene2.add(this.axes2);

// scene
this.sprite = new Sprite({
  textSize: 0.1,
  texture: {
      text: 'Vertical',
      fontFamily: 'Arial, Helvetica, sans-serif',
  },
  material: {color: 0x000000},
});

let spriteX = new Sprite({
  textSize: 20,
  texture: {
      text: 'X',
      fontFamily: 'Arial, Helvetica, sans-serif',
        },
  material: {color: "blue"},
});

spriteX.position.x=110;
this.scene2.add(spriteX);
let spriteY = new Sprite({
  textSize: 20,
  texture: {
      text: 'Y',
      fontFamily: 'Arial, Helvetica, sans-serif',
        },
  material: {color: "blue"},
});

spriteY.position.y=110;
this.scene2.add(spriteY);
let spriteZ = new Sprite({
  textSize: 20,
  texture: {
      text: 'Z',
      fontFamily: 'Arial, Helvetica, sans-serif',
        },
  material: {color: "blue"},
});

spriteZ.position.z=110;
this.scene2.add(spriteZ);


let container3= document.getElementById("vessel_type");
this.renderer3 = new THREE.WebGLRenderer({ alpha: true });
this.renderer3.setClearColor(0x000000,0);
this.renderer3.setSize(75,75);

container3.appendChild(this.renderer3.domElement);
this.scene3=new THREE.Scene();
//renderer
// this.scene3.background = new THREE.Color(col);
this.camera3 = new THREE.PerspectiveCamera( 5,105 / 105, 1, 1000 );
this.camera3.up = this.camera.up; // important!
this.scene3.add(this.sprite);



// sprite.lookAt(this.camera);


    window.addEventListener('resize', this.onWindowResize, false);
    // this.controls = new TrackballControls(this.camera, this.renderer.domElement);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  
    this.shapes = [];
    let ambient = new THREE.AmbientLight(0xbbbbbb);
    this.scene.add(ambient);
    let directionalLight = new THREE.DirectionalLight(0xffffff);
    let directionalLight2 = new THREE.DirectionalLight(0xffffff);
    directionalLight2.position.set(0, 0, -1000);
    this.scene.add(directionalLight2);
    this.controls.enabled=true;
    this.controls.screenSpacePanning = true;
    this.controls.enablePan=true;
    // this.controls.mouseButtons = {ORBIT:THREE.MOUSE.RIGHT, ZOOM:THREE.MOUSE.MIDDLE,PAN: THREE.MOUSE.LEFT};
    this.controls.update();
    directionalLight.position.set(0, 0, 1000);
    this.scene.add(directionalLight);
    this.material = new THREE.MeshPhongMaterial({
      color: '#0b7dba',
      emissive: 0x072534,
    });

    this.radial_position = 0;
    this.axesHelper = new THREE.AxesHelper(1000);
    this.scene.add(this.axesHelper);
    this.name=null;
    this.compID=null;
    this.heights = {};
    this.weights = {};
    this.heights_only = [];

//     let  textGeo = new THREE.TextGeometry('Y', {
//       size: 5,
//       height: 2,
//       curveSegments: 6,
//       style: "normal"       
//     });
//  var  color = new THREE.Color();
//  color.setRGB(255, 250, 250);
//  var  textMaterial = new THREE.MeshBasicMaterial({ color: color });
//  var  text = new THREE.Mesh(textGeo , textMaterial);
 
//  text.position.x = this.axes2.geometry.vertices[1].x;
//  text.position.y = this.axes2.geometry.vertices[1].y;
//  text.position.z = this.axes2.geometry.vertices[1].z;
//  text.rotation = this.camera2.rotation;
//  this.scene2.add(text);
    this.start();
    this.selected_component = 0;
  }

  onDocumentMouseDown = (event) => {
    var raycaster = new THREE.Raycaster(); // create once
    var mouse = new THREE.Vector2(); // create once
    let rect = document.getElementById("scener").getBoundingClientRect();
    // console.log("coord",event.clientX,event.clientY);
    // console.log("unresize",rect);
    mouse.x = (event.clientX -rect.x) / (window.innerWidth-rect.x) * 2 - 1;
    mouse.y = -((event.clientY-rect.y) / (window.innerHeight-rect.y))* 2 + 1;
    raycaster.setFromCamera( mouse, this.camera );
  if (this.shapes.length >= 1) {
     // let intersects = raycaster.intersectObjects(this.shapes, true);
    var intersects = raycaster.intersectObjects(this.shapes, true);
     if (intersects.length > 0) {
        intersects[0].object.material.transparent = true;
        let name = null;
        if (intersects[0].object.parent.name) {
          name = intersects[0].object.parent.name;
        } else {
          name = intersects[0].object.name;
        }
        try {
          const sh = [...this.shapes];
          sh.map((shape) => {
            let sh_name = shape.name.split("&");
            if(this.name===sh_name[1])
            {
            if (sh_name[1] === "Cylinder" || sh_name[1]==="Conical") {
              shape.material.opacity = 1;
            } else {
              shape.children.map((child) => {
                child.material.opacity = 1;
                return 0;
              })
            }
          }
            return 0;
          });
        } catch (e) {
          console.log(e)
        }
        if (intersects[0].object.material.opacity === 1) {
          intersects[0].object.material.opacity = 0.5;
        } else {
          intersects[0].object.material.opacity = 1;
        }
        let res=null;
        if(name){
        res=name.split("&");
        this.name = res[1];
        this.compoID=res[0];
         this.props.updateSelectedComponentID(res[0]);
         this.props.treeUpdate(false);
        this.props.modelImport(res[1], 1);
        this.props.returnComponentID(res[0]);
        this.props.componentClicked(true);
        }
        else{
          res=[-1,"noComponent"];
        }
        //intersects[0].object.material.opacity = 0.5;
      }
      else{
        this.props.displayComponentTree(true);
      }
    }
   //this.controls.update();
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
      case "ISOMETRIC":
        this.camera.position.set(10, 10, 10);
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
  onWindowResize = () => {
    let left = document.getElementById("scener").getBoundingClientRect();
    // console.log("onresize",left)
    this.camera.aspect = (window.innerWidth-left.x) / (window.innerHeight-left.y);
    this.camera.updateProjectionMatrix();
    this.renderer.setSize((window.innerWidth-left.x), (window.innerHeight-left.y));
  }

  componentWillReceiveProps(nextProps) {}

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

  clear_opacity=(component,t)=>{
    if(this.name===component.component.toString() && this.compoID===component.componentID.toString()){
      t.opacity=0.5;
    }
    else{
      t.opacity=1;
    }
  }

  
  render(){
      let first_shell = true;
      let height_position = 0;
      this.weights = {};
      this.heights = {};
      let cylinder_iterator = 0;
      let cylinder_lengths = [];
      this.shapes = [];
      let scaler = 100;
      let t={ color: '#037d23',
      emissive: 0x072534,
      side: THREE.DoubleSide,
      transparent:true,
      opacity:1,
      shininess:100
    };
      if (this.scene) {
        if (this.scene.children) {
          this.clearScene();
        }
      }
      if (this.props.component.length >= 0 && this.scene) {
        for (let i = 0; i < this.props.component.length; i++) {
          if (!isEmpty(this.props.component[i])) {
            this.clear_opacity(this.props.component[i],t)
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
                                                "vertical");
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
                break;}
            case "Ellipsoidal Head":
            {
              let values =ellipseRenderer(this.props.component,
                                          this.props.component[i],
                                          this.heights,
                                          this.weights,
                                          scaler,t,
                                          "vertical") ;
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
            if(this.props.component[i].type_name === "LWN") {
              let values=nozzleRenderer(this.props.component,
                                        this.props.component[i],
                                        scaler,
                                        t,
                                        this.heights,
                                        this.weights,
                                        this.heights_only,
                                        "vertical");         
              let nozzle =values[0];       
              this.heights=values[1];       
              this.weights=values[2];  
              nozzle.name=values[5]+"&"+values[4]; 
              this.shapes.push(nozzle);
              this.scene.add(nozzle);

            } else if (this.props.component[i].type_name === "HB") {
            //   let length = this.props.component[i].length / scaler;
            //   let orientation = this.props.component[i].orientation;
            //   let orientation_in_rad = (orientation / 180) * math.pi;
            //   let nozzle_height = this.props.component[i].height / scaler;
            //   let nozzle = new THREE.Mesh();
            //   nozzle = Curve_nozzle(length, 1);
            //   nozzle.translateZ(-this.radial_position * math.cos(orientation_in_rad)).translateX(this.radial_position * math.sin(orientation_in_rad)).translateY(nozzle_height).rotateY(-orientation_in_rad);
            //   this.scene.add(nozzle);
            //   nozzle.name = this.props.component[i].componentID + "&" + this.props.component[i].component;
            //   this.shapes.push(nozzle);
            //  let arr = keepHeightRecord(this.heights,this.weights,this.props.component[i], -500, 0);
            //  this.heights=arr[0];
            //  this.weights=arr[1]

            }
             break; 
          }
            case "Skirt":
            {
              // let values=skirtRenderer(this.props.component[i],
              //                          scaler,
              //                          t,
              //                          this.heights,
              //                          this.weights);
              let values=skirtRenderer2(this.props.component[i],
                scaler,
                t,
                this.heights,
                this.weights);
              let skirt =values[0];
              skirt.name = values[4] + "&" + values[3];
              this.scene.add(skirt)
              this.shapes.push(skirt);
              this.heights=values[1];
              this.weights=values[2];
              break;
            }
            case "Lifting Lug":
            {
              let values=liftingLugRenderer(this.props.component[i],
                                            this.props.component,
                                            scaler,
                                            t,
                                            this.heights,
                                            this.weights);
              let lug1 =values[0];
              let lug2=values[1];
              lug1.name = values[5] + "&" + values[4];
              lug2.name=values[5]+"&" +values[4];
              this.scene.add(lug1);
              this.scene.add(lug2);
              this.shapes.push(lug1);
              this.shapes.push(lug2);
              this.heights=values[2];
              this.weights=values[3];
              break;
            }
            default:
            break;
          }
            this.start();
          }
        }
      }
      return ( < div > <div width = '100%'  
                             height = '100%'
                             ref = {
                            (mount) => {
                              this.mount = mount
                            }
                          }
                          id = "scener">
                          <div id="inset" style={inset}/>
                          <div  id="vessel_type" style={vessel_type} />
                          </div>
             </div>
      );
  
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


export default connect(mapStateToProps, mapDispatchToProps)(Scene);