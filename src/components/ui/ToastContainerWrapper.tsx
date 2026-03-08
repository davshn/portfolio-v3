import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const TOAST_AUTO_CLOSE_MS = 2000

export default function ToastContainerWrapper(): React.ReactElement {
  return (
    <ToastContainer
      position="top-right"
      autoClose={TOAST_AUTO_CLOSE_MS}
      pauseOnHover
      draggable
      closeOnClick
    />
  )
}
