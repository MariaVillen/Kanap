import { ProductItem } from "./app/ProductItem.mjs";

window.onload = ProductItem.loadAll(document.getElementById("items"));
