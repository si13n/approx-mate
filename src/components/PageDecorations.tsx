import orbitBottomLeft from "../assets/new-homepage/orbit-bottom-left.svg"
import orbitPoint from "../assets/new-homepage/orbit-point.svg"
import orbitRight from "../assets/new-homepage/orbit-right.svg"
import orbitTopLeft from "../assets/new-homepage/orbit-top-left.svg"

export function PageDecorations() {
  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      <img
        src={orbitTopLeft}
        alt=""
        className="absolute -left-[245px] -top-[330px] size-[520px] desktop:-left-[270px] desktop:-top-[360px] desktop:size-[620px]"
      />
      <img
        src={orbitRight}
        alt=""
        className="absolute -right-[330px] top-[260px] size-[470px] desktop:-right-[90px] desktop:top-[300px] desktop:size-[520px]"
      />
      <img
        src={orbitBottomLeft}
        alt=""
        className="absolute -left-[430px] bottom-[150px] hidden size-[560px] desktop:block"
      />
      <img
        src={orbitPoint}
        alt=""
        className="absolute left-[41%] top-[125px] size-2 desktop:left-[17%] desktop:top-[145px]"
      />
      <img
        src={orbitPoint}
        alt=""
        className="absolute right-[8%] top-[560px] size-2 desktop:right-[9%] desktop:top-[510px]"
      />
      <img
        src={orbitPoint}
        alt=""
        className="absolute bottom-[370px] left-[8%] hidden size-2 desktop:block"
      />
    </div>
  )
}
