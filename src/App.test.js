import React from "react"
import { render } from "@testing-library/react"
import App from "./App"

test("renders Pull up", () => {
  const { getByText } = render(<App />)
  const linkElement = getByText(/Pull up/i)
  expect(linkElement).toBeInTheDocument()
})
