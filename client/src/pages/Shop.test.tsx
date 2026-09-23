import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Shop from "./Shop";

const mocks = vi.hoisted(() => ({
  query: { data: [], isLoading: false, isError: false } as { data: never[]; isLoading: boolean; isError: boolean },
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    commerce: {
      products: {
        list: { useQuery: () => mocks.query },
      },
    },
  },
}));

vi.mock("@/components/storefront/SiteHeader", () => ({ SiteHeader: () => <header>Navigation</header> }));
vi.mock("@/components/storefront/SiteFooter", () => ({ SiteFooter: () => <footer>Pied de page</footer> }));

describe("Shop", () => {
  beforeEach(() => {
    mocks.query = { data: [], isLoading: false, isError: false };
  });

  it("annonce explicitement le chargement du catalogue", () => {
    mocks.query = { data: [], isLoading: true, isError: false };
    render(<Shop />);

    expect(screen.getByRole("status", { name: "Chargement du catalogue" })).toBeInTheDocument();
  });

  it("présente une attente éditoriale lorsque le catalogue est vide", () => {
    render(<Shop />);

    expect(screen.getByText("Les rayons business prennent forme.")).toBeInTheDocument();
  });

  it("informe clairement le visiteur si le catalogue est indisponible", () => {
    mocks.query = { data: [], isLoading: false, isError: true };
    render(<Shop />);

    expect(screen.getByText(/Le catalogue business n’est pas disponible pour le moment/i)).toBeInTheDocument();
  });
});
