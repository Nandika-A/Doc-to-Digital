import * as BABYLON from 'babylonjs';
import 'babylonjs-loaders';


// Global BabylonJS Variables
var canvas ;
var engine ; 
var scene ;
var camera ;
var dirLight ;
var hemiLight; 
var shadowGenerator;

var ground;
var hdrTexture;
var hdrRotation = 0;
var hdrSkybox;
var currentAnimation;

document.addEventListener("DOMContentLoaded", startGame);

// Start Game
function startGame() {
    // Set Canvas & Engine //
    canvas = document.getElementById("renderCanvas");
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    //console.log(canvas);
    engine = new BABYLON.Engine(canvas, true);
    scene = createScene(engine, canvas);
    camera = new BABYLON.FollowCamera("FollowCam", new BABYLON.Vector3(0, 0, 0), scene);
    console.log(camera);
    var toRender = function () {
        scene.render();
    }
    engine.runRenderLoop(toRender);
    
    createCamera();

    // Hemispheric Light //
    hemiLight = new BABYLON.HemisphericLight("hemiLight", new BABYLON.Vector3(0, 1, 0), scene);
    hemiLight.intensity = 0.1;

    // Directional Light //
    dirLight = new BABYLON.DirectionalLight("dirLight", new BABYLON.Vector3(0,0,0), scene);
    dirLight.intensity = 1.5;
    dirLight.position = new BABYLON.Vector3(0,30,10);
    dirLight.direction = new BABYLON.Vector3(-2, -4, -5);

    // Cylinder Ground //
    ground = BABYLON.MeshBuilder.CreateCylinder("ground", {diameter: 7, height: 0.2, tessellation: 80}, scene);
    ground.position.y = -0.1;
    ground.isPickable = false;
    var groundMat = new BABYLON.PBRMaterial("groundMaterial", scene);
    groundMat.albedoColor = new BABYLON.Color3(0.95,0.95,0.95);
    groundMat.roughness = 0.15;
    groundMat.metallic = 0;
    groundMat.specularIntensity = 0;
    ground.material = groundMat;
    ground.receiveShadows = true;

    setLighting();    
    importAnimationsAndModel("https://models.readyplayer.me/65f86c8897e3a356389d9b8c.glb?quality=high");

    // scene.debugLayer.show({embedMode: true}).then(function () {
    // });
}

// Create Scene
function createScene(engine, canvas) {
    // Set Canvas & Engine //
    var scene = new BABYLON.Scene(engine);
    return scene;
}



// Create Follow Camera
function createCamera() {  
    camera.position.z = 2.5;
    camera.position.y = 1.2;
    camera.attachControl(canvas, true);
    camera.setTarget(new BABYLON.Vector3(0, 1, 0));
}

// Setup Animations & Player
var player;
var animationsGLB = [];
// Import Animations and Models
async function importAnimationsAndModel(model) {
    await importAnimations("F_Standing_Idle_001.glb");
    // for (let index = 0; index < 9; index++) {
    //   var int = index + 1;
    //   await importAnimations("/masculine/dance/M_Dances_00" + int + ".glb");
    // }
    // for (let index = 5; index < 9; index++) {
    //     var int = index + 1;
    //     await importAnimations("/masculine/expression/M_Standing_Expressions_00" + int + ".glb");
    // }
    importModel(model);
}


// Import Animations
async function importAnimations(animation) {
    console.log(animation)
    return BABYLON.SceneLoader.ImportMeshAsync(null, "static/animations/", animation, scene)
       .then((result) => {
        result.meshes.forEach(element => {
            if (element)
                element.dispose();  
        });
        animationsGLB.push(result.animationGroups[0]);
    });
}
  
// Import Model
function importModel(model) {
    console.log(model);
    BABYLON.SceneLoader.ImportMeshAsync(null, model, null, scene)
       .then((result) => {

        player = result.meshes[0];
        player.name = "Character";

        var modelTransformNodes = player.getChildTransformNodes();
        
        animationsGLB.forEach((animation) => {
          const modelAnimationGroup = animation.clone(model.replace(".glb", "_") + animation.name, (oldTarget) => {
            return modelTransformNodes.find((node) => node.name === oldTarget.name);
          });
          console.log(modelAnimationGroup);
          animation.dispose();
        });
        
        animationsGLB = [];

        // Merge Meshes
    
        setReflections();
        setShadows();
        scene.animationGroups[0].play(true, 1.0);
        console.log("Animations: " + scene.animationGroups);
        console.log("Animations: " + scene.animationGroups.length);
        // document.getElementById("info-text").innerHTML = "Current Animation<br>" + scene.animationGroups[0].name;
        currentAnimation = scene.animationGroups[0];
        hideLoadingView();
 
    });
}



function randomAnimation() {  

    var randomNumber = 4; //getInt(1, 13);
    var newAnimation = scene.animationGroups[randomNumber];
    // console.log("Random Animation: " + newAnimation.name);

    // Check if currentAnimation === newAnimation
    // while (currentAnimation === newAnimation) {
    //     randomNumber = getRandomInt(1, 9);
    //     newAnimation = scene.animationGroups[randomNumber];
    //     console.log("Rechecking Anim: " + newAnimation.name);
    // }

    scene.onBeforeRenderObservable.runCoroutineAsync(animationBlending(currentAnimation, 1.0, newAnimation, 1.0, true, 0.02));
    //document.getElementById("info-text").innerHTML = "Current Animation<br>" + newAnimation.name;
}

// Animation Blending
function* animationBlending(fromAnim, fromAnimSpeedRatio, toAnim, toAnimSpeedRatio, repeat, speed)
{
    let currentWeight = 1;
    let newWeight = 0;
    fromAnim.stop();
    toAnim.play(repeat);
    fromAnim.speedRatio = fromAnimSpeedRatio;
    toAnim.speedRatio = toAnimSpeedRatio;
    while(newWeight < 1)
    {
        newWeight += speed;
        currentWeight -= speed;
        toAnim.setWeightForAllAnimatables(newWeight);
        fromAnim.setWeightForAllAnimatables(currentWeight);
        yield;
    }

    currentAnimation = toAnim;
}

// Environment Lighting
function setLighting() {
    hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("./static/environment.env", scene);
    hdrTexture.rotationY = BABYLON.Tools.ToRadians(hdrRotation);
    hdrSkybox = BABYLON.MeshBuilder.CreateBox("skybox", {size: 1024}, scene);
    var hdrSkyboxMaterial = new BABYLON.PBRMaterial("skybox", scene);
    hdrSkyboxMaterial.backFaceCulling = false;
    hdrSkyboxMaterial.reflectionTexture = hdrTexture.clone();
    hdrSkyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
    hdrSkyboxMaterial.microSurface = 0.4;
    hdrSkyboxMaterial.disableLighting = true;
    hdrSkybox.material = hdrSkyboxMaterial;
    hdrSkybox.infiniteDistance = true;
}

// Set Shadows
function setShadows() {
    shadowGenerator = new BABYLON.ShadowGenerator(2048, dirLight, true);
    scene.meshes.forEach(function(mesh) {
        if (mesh.name != "skybox" 
        && mesh.name != "ground")
        {
            shadowGenerator.darkness = 0.1;
            shadowGenerator.bias = 0.00001;
            shadowGenerator.useBlurExponentialShadowMap = true;
            shadowGenerator.addShadowCaster(mesh);
        }
    });
}

// Set Reflections
function setReflections() {
    scene.materials.forEach(function (material) {
        if (material.name != "skybox") {
            material.reflectionTexture = hdrTexture;
            material.reflectionTexture.level = 0.9;
            material.environmentIntensity = 0.7;
            material.disableLighting = false;
        }
    });
}

// Hide Loading View
function hideLoadingView() {
    document.getElementById("loadingDiv").style.display = "none";
}

// // Resize Window
// window.addEventListener("resize", function () {
//     engine.resize();
// });