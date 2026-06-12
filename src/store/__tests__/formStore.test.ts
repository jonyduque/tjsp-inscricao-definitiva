import { beforeEach, describe, expect, it } from "vitest";
import { useFormStore } from "../formStore";

describe("useFormStore", () => {
  beforeEach(() => {
    const store = useFormStore.getState();
    store.reset();
  });

  it("deve atualizar o nome do candidato", () => {
    const store = useFormStore.getState();
    store.setCandidateName("Dr. Roberto Silva");
    expect(useFormStore.getState().candidateName).toBe("Dr. Roberto Silva");
  });

  it("deve marcar/desmarcar item sem filhos", () => {
    const store = useFormStore.getState();
    store.toggleItem("doc-fotos");
    expect(useFormStore.getState().checkedItems["doc-fotos"]).toBe(true);

    store.toggleItem("doc-fotos");
    expect(useFormStore.getState().checkedItems["doc-fotos"]).toBe(false);
  });

  it("deve marcar todos os filhos ao marcar o pai", () => {
    const store = useFormStore.getState();
    store.toggleItem("cert-federal");
    expect(useFormStore.getState().checkedItems["cert-fed-civel"]).toBe(true);
    expect(useFormStore.getState().checkedItems["cert-fed-criminal"]).toBe(
      true,
    );
  });

  it("deve marcar o pai se todos os filhos forem marcados individualmente", () => {
    const store = useFormStore.getState();
    store.toggleItem("cert-fed-civel");
    expect(useFormStore.getState().checkedItems["cert-federal"]).toBe(
      undefined,
    );

    store.toggleItem("cert-fed-criminal");
    expect(useFormStore.getState().checkedItems["cert-federal"]).toBe(true);
  });

  it("deve desmarcar o pai se um dos filhos for desmarcado", () => {
    const store = useFormStore.getState();
    store.toggleItem("cert-federal");
    expect(useFormStore.getState().checkedItems["cert-federal"]).toBe(true);

    store.toggleItem("cert-fed-civel");
    expect(useFormStore.getState().checkedItems["cert-federal"]).toBe(false);
  });

  it("deve salvar e remover anotações", () => {
    const store = useFormStore.getState();
    store.setNote("doc-fotos", "Fotos retiradas em 10/06");
    expect(useFormStore.getState().notes["doc-fotos"]).toBe(
      "Fotos retiradas em 10/06",
    );

    store.setNote("doc-fotos", "");
    expect(useFormStore.getState().notes["doc-fotos"]).toBe(undefined);
  });
});
