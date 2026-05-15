import "react";

declare module "react" {
  interface ImgHTMLAttributes<T> {
    /** HTML i vogël — përputhet me DOM dhe shmang warning në React 18 */
    fetchpriority?: "high" | "low" | "auto";
  }
}
