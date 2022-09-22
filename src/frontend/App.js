import "./App.css"
import { Uploader } from "./utils/upload"
import { useEffect, useState } from "react"

function App() {
  const [file, setFile] = useState(undefined)
  const [showPercentage, setShowPercentage] = useState(0)
  const [uploader, setUploader] = useState(undefined)
  useEffect(() => {
    if (file) {

      const videoUploaderOptions = {
        fileName: file.name,
        file: file,
        threadsQuantity:5,
      }
    
      let percentage = undefined
      const uploader = new Uploader(videoUploaderOptions)
      setUploader(uploader)

      uploader
        .onProgress(({ percentage: newPercentage }) => {
          // to avoid the same percentage to be logged twice
          if (newPercentage !== percentage) {
            percentage = newPercentage
            setShowPercentage(percentage)
            console.log(`${percentage}%`)
          }
        })
        .onError((error) => {
          setFile(undefined)
          console.error(error)
        })
    }
  }, [file])

  const onCancel = () => {
    if (uploader) {
      uploader.abort()
      setFile(undefined)
    }
  }
  const onUpload = () => {
    if (uploader) {
      uploader.start()
    }
  }

  return (
    <div className="App">
      <h1>Upload your file</h1>
      <div>
        <input
          type="file"
          onChange={(e) => {
            setFile(e.target?.files?.[0])
          }}
        />
      </div>
      <div> 
        <span>
           上传进度
        </span>
        <span>{showPercentage}%</span>
        </div>
      <div>
      <button onClick={onUpload}>上传</button>
      &nbsp;&nbsp;&nbsp;
      <button onClick={onCancel}>取消</button>
      </div>
    </div>
  )
}

export default App
