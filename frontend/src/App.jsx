import { RouterProvider, createBrowserRouter } from "react-router-dom"
import { QueryClientProvider } from "@tanstack/react-query"
import { ToastContainer, Slide } from "react-toastify"
import { queryClient } from "./lib/queryClient"
import { routes } from "./routes"
import "react-toastify/dist/ReactToastify.css"

const router = createBrowserRouter(routes)

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
			<ToastContainer position="top-right" transition={Slide} newestOnTop />
		</QueryClientProvider>
	)
}

export default App
