<template>
  <section id="container">
    <Viewer />
  </section>
</template>

<script>
import * as Three from 'three'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Viewer from './components/Viewer.vue'

export default {
  name: 'App',
  components: {
    Viewer
  },
  data () {
    return {
      camera: null,
      scene: null,
      renderer: null,
      mesh: null,
      mode: null
    }
  },
  mounted () {
    // var scene = new Three.Scene()
    // var camera = new Three.PerspectiveCamera(150, window.innerWidth / window.innerHeight, 0.1, 1000)
    // var renderer = new Three.WebGLRenderer()
    // renderer.setSize(window.innerWidth, window.innerHeight)
    // renderer.setClearColor('#fff', 1)
    // document.getElementById('container').appendChild(renderer.domElement)
    // var geometry = new Three.BoxGeometry(1, 1, 1)
    // var material = new Three.MeshBasicMaterial({ color: '#4fc7c7' })
    // var cube = new Three.Mesh(geometry, material)
    // scene.add(cube)
    // var loader = new GLTFLoader()
    // const dracoLoader = new DRACOLoader()
    // dracoLoader.setDecoderPath('./draco/')
    // dracoLoader.setDecoderConfig({ type: 'js' })
    // var model
    // loader.load('/blasterA.glb', function (gltf) {
    //   model = gltf.scene
    //   scene.add(model)
    //   console.log(1231232)
    // }, undefined, function (error) {
    //   console.log(error)
    // })
    // camera.position.y = 1
    // camera.position.z = 5
    // var animate = function () {
    //   requestAnimationFrame(animate)
    //   cube.rotation.y += 0.01
    //   // if (model) {
    //   //   model.rotation.y += 0.01
    //   // }
    //   renderer.render(scene, camera)
    // }
    // animate()
    // this.init()
    // this.animate()
  },
  methods: {
    init () {
      const container = document.getElementById('container')
      console.log(container)
      this.camera = new Three.PerspectiveCamera(10, window.innerWidth / window.innerHeight, 0.1, 10000)
      this.renderer = new Three.WebGLRenderer({ antialias: true })
      this.camera.position.set(20, 20, 50)
      this.scene = new Three.Scene()
      this.renderer.setClearColor(new Three.Color('#e2e7ea'))
      this.renderer.setSize(window.innerWidth, window.innerHeight)
      this.renderer.shadowMap.enabled = true
      container.appendChild(this.renderer.domElement)
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.zoomSpeed = 0.05
      this.controls.target = new Three.Vector3(0, 0, 0)
      this.loadLight()
      this.load3D()
      // this.load3DObjAndMtl()
      // this.load3Dglb()
    },
    load3D () {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      dracoLoader.preload()
      loader.setDRACOLoader(dracoLoader)
      loader.load('/scene.gltf', (gltf) => {
        this.mesh = gltf.scene
        this.scene.add(gltf.scene)
        this.renderer.render(this.scene, this.camera)
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (error) => {
        console.error(error)
      })
    },
    load3Dglb () {
      const loader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      dracoLoader.preload()
      loader.setDRACOLoader(dracoLoader)
      loader.load('qiang.glb', (gltf) => {
        console.log(gltf)
        this.mesh = gltf.scene
        gltf.scene.traverse(function (child) {
          if (child.isMesh) {
            child.material.emissive = child.material.color
            child.material.emissiveMap = child.material.map
          }
        })
        this.scene.add(gltf.scene)
        this.renderer.render(this.scene, this.camera)
      }, (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
      }, (error) => {
        console.error(error)
      })
    },
    load3DObjAndMtl () {
      const mtlLoader = new MTLLoader()
      console.log(mtlLoader)
      mtlLoader.load('the_crowned_ring.mtl', (material) => {
        const objLoader = new OBJLoader()
        objLoader.setMaterials(material)
        objLoader.load('the_crowned_ring.obj', (object3D) => {
          object3D.scale.set(10, 10, 10)
          this.mode = object3D
          this.scene.add(object3D)
        })
      })
    },
    loadLight () {
      // 环境光
      const ambient = new Three.AmbientLight(0xFFFFFF)
      this.scene.add(ambient)
    },
    animate () {
      requestAnimationFrame(this.animate)
      if (this.mode) {
        this.mode.rotation.y += 0.01
      }
      this.renderer.render(this.scene, this.camera)
    },
    changeMaterialEmissive (parent) {
      parent.traverse(function (obj) {
        if (obj instanceof Three.Mesh) {
          obj.material.emissive = new Three.Color(1, 1, 1)
          obj.material.emissiveIntensity = 1
          obj.material.emissiveMap = obj.material.map
        }
      })
    }
  }
}
</script>

<style>
body { margin: 0; }
canvas { width: 100%; height: 100% }
#container {
  width: 100%;
  height: calc(100vh - 84px);
}
.gui-wrap {
  position: absolute;
  top: 0;
}
</style>
