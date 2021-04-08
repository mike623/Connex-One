import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./apiClient", () => ({
  getTime: () => ({ epoch: "1617922880154" }),
  getMetrics: () => "Metrics",
}));

test("renders learn react link", async () => {
  render(<App />);
  await screen.findByText("1617922880154");
  await screen.findByText("Metrics");
});
