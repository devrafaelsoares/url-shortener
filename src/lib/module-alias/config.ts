import path from "path";

export default {
    "@": path.join(__dirname, "..", ".."),
    "@infra/*": path.resolve("src", "infra"),
    "@lib": path.join(__dirname, ".."),
};
