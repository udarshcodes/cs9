import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { ToastContainer, Slide } from "react-toastify"
import { routes } from "./routes"
import "react-toastify/dist/ReactToastify.css"

const router = createBrowserRouter(routes)

function App() {
	return (
		<>
			<RouterProvider router={router} />
			<ToastContainer position="top-right" transition={Slide} newestOnTop />
		</>
	)
}

export default App
