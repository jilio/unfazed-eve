import { justbash } from "eve/sandbox/just-bash";

// Pin the sandbox backend to just-bash (pure-JS, in-process): this deployment
// has no external sandbox runtime, and pinning it keeps eve from probing the
// optional `microsandbox` backend.
export default justbash();
