import './PencilLoader.css'; // move CSS here

export default function PencilLoaderWithBookCap() {
  return (
    <div className="pencil-container">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="200"
        height="200"
        viewBox="0 0 200 200"
        className="pencil"
      >
        <defs>
          <clipPath id="pencil-eraser">
            <rect height="30" width="30" rx="5" ry="5" />
          </clipPath>
        </defs>

        {/* Outer Stroke */}
        <circle
          transform="rotate(-113,100,100)"
          strokeLinecap="round"
          strokeDashoffset="439.82"
          strokeDasharray="439.82 439.82"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          r="70"
          className="pencil__stroke"
        ></circle>

        {/* FIXED BOOK + CAP ICON */}
        <g transform="translate(100,100) scale(0.5)">
          {/* Left cover */}
          <path
            d="M -55 -35 L -10 -20 L -10 40 L -55 25 Z"
            fill="hsl(223,30%,30%)"
          />
          {/* Right cover */}
          <path
            d="M 55 -35 L 10 -20 L 10 40 L 55 25 Z"
            fill="hsl(223,20%,20%)"
          />

          {/* Pages */}
          <rect x="-10" y="-20" width="20" height="60" fill="hsl(0,0%,96%)" />

          {/* Page lines */}
          <line
            x1="-8"
            y1="-10"
            x2="8"
            y2="-10"
            stroke="hsl(0,0%,80%)"
            strokeWidth="2"
          />
          <line
            x1="-8"
            y1="0"
            x2="8"
            y2="0"
            stroke="hsl(0,0%,80%)"
            strokeWidth="2"
          />
          <line
            x1="-8"
            y1="10"
            x2="8"
            y2="10"
            stroke="hsl(0,0%,80%)"
            strokeWidth="2"
          />
          <line
            x1="-8"
            y1="20"
            x2="8"
            y2="20"
            stroke="hsl(0,0%,80%)"
            strokeWidth="2"
          />

          {/* Cap */}
          <polygon points="-45,-45 45,-45 0,-75" fill="hsl(223,20%,15%)" />

          <rect
            x="-35"
            y="-45"
            width="70"
            height="10"
            fill="hsl(223,20%,20%)"
          />

          {/* Tassel */}
          <line
            x1="20"
            y1="-45"
            x2="40"
            y2="-15"
            stroke="hsl(33,90%,50%)"
            strokeWidth="4"
          />
          <circle cx="40" cy="-15" r="6" fill="hsl(33,90%,50%)" />
        </g>

        {/* PENCIL ROTATE GROUP */}
        <g transform="translate(100,100)" className="pencil__rotate">
          <g fill="none">
            <circle
              transform="rotate(-90)"
              strokeDashoffset="402"
              strokeDasharray="402.12 402.12"
              strokeWidth="30"
              stroke="hsl(223,90%,50%)"
              r="64"
              className="pencil__body1"
            ></circle>

            <circle
              transform="rotate(-90)"
              strokeDashoffset="465"
              strokeDasharray="464.96 464.96"
              strokeWidth="10"
              stroke="hsl(223,90%,60%)"
              r="74"
              className="pencil__body2"
            ></circle>

            <circle
              transform="rotate(-90)"
              strokeDashoffset="339"
              strokeDasharray="339.29 339.29"
              strokeWidth="10"
              stroke="hsl(223,90%,40%)"
              r="54"
              className="pencil__body3"
            ></circle>
          </g>

          {/* Eraser */}
          <g transform="rotate(-90) translate(49,0)" className="pencil__eraser">
            <g className="pencil__eraser-skew">
              <rect
                height="30"
                width="30"
                rx="5"
                ry="5"
                fill="hsl(223,90%,70%)"
              ></rect>
              <rect
                clipPath="url(#pencil-eraser)"
                height="30"
                width="5"
                fill="hsl(223,90%,60%)"
              ></rect>
              <rect height="20" width="30" fill="hsl(223,10%,90%)"></rect>
              <rect height="20" width="15" fill="hsl(223,10%,70%)"></rect>
              <rect height="20" width="5" fill="hsl(223,10%,80%)"></rect>
              <rect
                height="2"
                width="30"
                y="6"
                fill="hsla(223,10%,10%,0.2)"
              ></rect>
              <rect
                height="2"
                width="30"
                y="13"
                fill="hsla(223,10%,10%,0.2)"
              ></rect>
            </g>
          </g>

          {/* Pencil Tip */}
          <g
            transform="rotate(-90) translate(49,-30)"
            className="pencil__point"
          >
            <polygon points="15 0,30 30,0 30" fill="hsl(33,90%,70%)"></polygon>
            <polygon points="15 0,6 30,0 30" fill="hsl(33,90%,50%)"></polygon>
            <polygon
              points="15 0,20 10,10 10"
              fill="hsl(223,10%,10%)"
            ></polygon>
          </g>
        </g>
      </svg>
    </div>
  );
}
