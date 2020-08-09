import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import fetchMock from "jest-fetch-mock";
import mockResponse from "./__mocks__/subreddit-reactjs-response.json";

fetchMock.enableMocks();

describe("Header", () => {
  test.each([/how it works/i, /about/i])(
    "'%s' points to the correct page",
    (param) => {
      render(
        <MemoryRouter>
          <App />
        </MemoryRouter>
      );
      // screen.debug();
      const link = screen.getByRole("link", { name: param });
      userEvent.click(link);
      // screen.debug();
      expect(screen.getByRole("heading", { name: param })).toBeInTheDocument();
    }
  );

  it("logo points to the correct page", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );
    // screen.debug();
    const link = screen.getByRole("link", { name: /logo/i });
    userEvent.click(link);
    // screen.debug();
    expect(
      screen.getByRole("heading", { name: /find the top posts/i })
    ).toBeInTheDocument();
  });
});

function setup() {
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
}

describe("Subreddit form", () => {
  it("loads posts that rendered on the page", async () => {
    fetch.once(JSON.stringify(mockResponse));
    setup();
    const input = screen.getByLabelText("r /");
    userEvent.type(input, "reactjs");

    const button = screen.getByRole("button", { name: /search/i });
    userEvent.click(button);
    expect(screen.getByText(/is loading/i)).toBeInTheDocument();

    const number = await screen.findByText(/number of top posts: 25/i);
    expect(number).toBeInTheDocument();
    expect(fetch).toHaveBeenCalledWith(
      "https://www.reddit.com/r/reactjs/top.json"
    );
  });
});
