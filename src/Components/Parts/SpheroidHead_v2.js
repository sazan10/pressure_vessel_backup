import {BufferGeometry, Float32BufferAttribute, Vector3} from 'three';


/**
 * @Author Pritesh Pratap Rana
 * 
 */
//This are some sets of predefined shapes used in the calcgen project

//Half Ellipsoid with cylindrical base

function SpheroidHeadBufferGeometry ( 
    outerRadius=3, outerHeight=1, innerRadius=2.8, innerHeight=0.8, radialSegments = 50, heightSegments = 20,
    ringSegments = 1){
    BufferGeometry.call(this);
    this.type = 'SpheroidHeadBufferGeometry';
    this.parameters = {
        outerRadius: outerRadius,
        outerHeight: outerHeight,
        innerRadius: innerRadius,
        innerHeight: innerHeight,
        radialSemgents: radialSegments,
        heightSegments: heightSegments,
    };

    //Buffers
    const indices = [];
    

    const outerVertices = [];
    const innerVertices = [];
    const ringVertices = [];
    let index = 0;
    let grid = [];
    let x1 = 0, x2 = 0;
    let y1 = 0, y2 = 0;
    let z1 = 0, z2 = 0;
    let l1 = 0, l2 = 0;
    let m1 = 0, m2 = 0;
    let n1 = 0, n2 =0;
    const outerNormals = [];
    const innerNormals = [];
    
    let a1 = outerRadius;
    let b1 = outerHeight;
    let a2 = innerRadius;
    let b2 = innerHeight;
    let alphaAngle = 0;
    let thetaAngle = 0;
    // let v,u;  
    
    const alphaStart = 0, thetaStart = 0;
    const alphaLength = Math.PI *2;
    const thetaLength = Math.PI/2;
    //Calculating Vertices for outer and inner Spheroid
    for (let i = 0; i< heightSegments; i++){
        // v = i/heightSegments;
        let verticesRow = [];

        for (let j = 0; j < radialSegments; j ++){
            // u = j/radialSegments;
            alphaAngle = alphaStart + j/radialSegments * alphaLength;
            //WE only use the half ellipsoid So
            thetaAngle = thetaStart + i/heightSegments * thetaLength;
            y1 = b1 * Math.sin(thetaAngle);
            x1 = a1 * Math.cos(thetaAngle) * Math.cos(alphaAngle);
            z1 = a1 * Math.cos(thetaAngle) * Math.sin(alphaAngle);
            y2 = b2 * Math.sin(thetaAngle);
            x2 = a2 * Math.cos(thetaAngle) * Math.cos(alphaAngle);
            z2 = a2 * Math.cos(thetaAngle) * Math.sin(alphaAngle);
            //Calculationg normals
            l1 = (2*x1)/(Math.pow(a1,2));
            m1 = (2*y1)/(Math.pow(b1,2));
            n1 = (2*z1)/(Math.pow(a1,2));
            let normal1 = new Vector3(l1,m1,n1);
            normal1.normalize();
            outerNormals.push(normal1.x, normal1.y, normal1.z);
            l2 = -(2*x2)/(Math.pow(a2,2));
            m2 = -(2*y2)/(Math.pow(b2,2));
            n2 = -(2*z2)/(Math.pow(a2,2));
            let normal2 = new Vector3(l2,m2,n2);
            normal2.normalize();
            innerNormals.push(normal2.x, normal2.y, normal2.z);
            outerVertices.push(x1,y1,z1);
            innerVertices.push(x2,y2,z2);

            // uvs.push(u, 1-v);
            verticesRow.push(index++);
        }
        verticesRow.push(index-radialSegments); //The last vertex should be the first one
        grid.push(verticesRow);
    }
    grid.push(new Array(radialSegments).fill(index));   //The last grid is the top itself
    
    let topVertex1 = new Vector3(0,b1,0);
    outerVertices.push(topVertex1.x, topVertex1.y, topVertex1.z);    //The final point on the minor axis
    outerNormals.push(0,1,0);
    let topVertex2 = new Vector3(0,b2,0);
    innerVertices.push(topVertex2.x, topVertex2.y, topVertex2.z);    //The final point on the minor axis
    innerNormals.push(0,-1,0);
    let temp_array = [];
    const normals = temp_array.concat(outerNormals, innerNormals);
    //For ring innerVertices
    let grid2 = [];
    let verticesRow = [];
    for (let i = 0; i< radialSegments; i ++){
        verticesRow.push(i);
    }
    verticesRow.push(0);
    grid2.push(verticesRow);

    //Ring indices and Vertices
    const lenVerticesSpheroid = outerVertices.length/3;
    for(let i = 1 , index = 0; i < ringSegments; i ++){
        verticesRow = [];
        for (let j = 0; j < radialSegments; j ++){
            alphaAngle = (j/radialSegments)*Math.PI*2;
            let radius = innerRadius + (i)*((outerRadius-innerRadius)/ringSegments);
            let y = 0;
            let x = radius * Math.cos(alphaAngle);
            let z = radius * Math.sin(alphaAngle);
            ringVertices.push(x, y, z);
            verticesRow.push((index++) + lenVerticesSpheroid);
        }
        verticesRow.push(index-radialSegments+lenVerticesSpheroid);
        grid2.push(verticesRow);
    }
    verticesRow =[];
    const lenVerticesSpheroidAndRing = ((outerVertices.length + ringVertices.length)/3);
    for (let i = 0, index = 0; i< radialSegments; i ++){
        verticesRow.push((index++) + lenVerticesSpheroidAndRing);
    }
    verticesRow.push(lenVerticesSpheroidAndRing);
    grid2.push(verticesRow);    
    const tempArray =[];
    const vertices = tempArray.concat(outerVertices,ringVertices,innerVertices);
    //For outer Spheroid
    for(let i = 0; i < heightSegments; i++){
        for (let j = 0; j < radialSegments; j++){
            let a = grid[i][j];
            let b = grid[i][j +1];
            let c = grid[i+1][j];
            let d = grid[i+1][j+1];
            indices.push(c,b,a);
            indices.push(b,c,d);
        }
    }
    //One extra geometry gets added
    //Simply remove the last one
    indices.pop();
    indices.pop();
    indices.pop();

    //For inner Spheroid
    for(let i = 0; i < heightSegments; i++){
        for (let j = 0; j < radialSegments; j++){
            let a = grid[i][j] + lenVerticesSpheroidAndRing;
            let b = grid[i][j +1] + lenVerticesSpheroidAndRing;
            let c = grid[i+1][j] + lenVerticesSpheroidAndRing;
            let d = grid[i+1][j+1] + lenVerticesSpheroidAndRing;
            indices.push(a,b,c);
            indices.push(d,c,b);
        }
    }
    //One extra geometry gets added
    //Simply remove the last one
    indices.pop();
    indices.pop();
    indices.pop();

    // //For the ring
    for (let i = 0; i< ringSegments ; i ++){
        for(let j = 0; j< radialSegments; j ++){
            let a = grid2[i][j];
            let b = grid2[i][j +1];
            let c = grid2[i+1][j];
            let d = grid2[i+1][j+1];
            indices.push(a,b,c);
            indices.push(d,c,b);
        }
    }
	this.setIndex( indices );
    this.addAttribute( 'position', new Float32BufferAttribute( vertices, 3 ) );
    // this.addAttribute( 'uv', new Float32BufferAttribute( uvs, 2 ) );
    // this.computeVertexNormals();
    this.addAttribute( 'normal', new Float32BufferAttribute( normals, 3 ) );  
}

SpheroidHeadBufferGeometry.prototype = Object.create( BufferGeometry.prototype );
SpheroidHeadBufferGeometry.prototype.constructor = SpheroidHeadBufferGeometry;

export { SpheroidHeadBufferGeometry };