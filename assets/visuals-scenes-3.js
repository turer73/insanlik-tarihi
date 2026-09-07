window.ITVisualScenes=Object.assign(window.ITVisualScenes||{}, {
    'persepolis': `
      <path class="paper" d="M121 369h558v45H121zM164 326h472v43H164z"/>
      <path class="paper" d="M208 133h55v193h-55zM330 105h55v221h-55zM452 105h55v221h-55zM574 133h55v193h-55z"/>
      <path class="accent" d="M194 113h83v20h-83zM316 85h83v20h-83zM438 85h83v20h-83zM560 113h83v20h-83z"/>
      <path class="dark" d="M224 161h23v165h-23zm122-28h23v193h-23zm122 0h23v193h-23zm122 28h23v165h-23z" opacity=".25"/>
      <path class="line" d="M154 348h492"/>
      <g class="dark" opacity=".72"><circle cx="239" cy="348" r="10"/><path d="M229 359h20l10 36h-40l10-36Z"/><circle cx="335" cy="348" r="10"/><path d="M325 359h20l10 36h-40l10-36Z"/><circle cx="431" cy="348" r="10"/><path d="M421 359h20l10 36h-40l10-36Z"/><circle cx="527" cy="348" r="10"/><path d="M517 359h20l10 36h-40l10-36Z"/></g>
    `,
    'iskenderiye': `
      <circle class="accent" cx="636" cy="112" r="57" opacity=".72"/>
      <path class="paper" d="M123 116h470v278H123z"/>
      <path class="dark" d="M155 148h406v34H155zM155 215h406v34H155zM155 282h406v34H155zM155 349h406v45H155z" opacity=".22"/>
      <g class="accent"><path d="M181 154h84v22h-84zM290 154h113v22H290zM427 154h92v22h-92zM175 221h121v22H175zM320 221h78v22h-78zM422 221h108v22H422zM184 288h91v22h-91zM299 288h129v22H299zM453 288h70v22H453z"/></g>
      <path class="line" d="M620 170v224M604 194h32M604 240h32M604 286h32M604 332h32"/>
      <path class="accent" d="M635 281c45 37 51 73 18 108-2-29-19-45-51-48 27-11 38-31 33-60Z"/>
      <path class="paper" d="M635 250c25 21 29 42 10 63-1-17-11-26-29-28 16-6 22-18 19-35Z"/>
      <path class="bgcut" d="M616 234l42 178" opacity=".8"/>
    `,
    'milankovic': `
      <ellipse class="line" cx="400" cy="250" rx="286" ry="134" transform="rotate(-11 400 250)"/><ellipse class="line" cx="400" cy="250" rx="215" ry="98" transform="rotate(17 400 250)" opacity=".52"/>
      <circle class="accent" cx="400" cy="250" r="71"/>
      <path class="paper" d="M352 243c25-52 76-61 119-22-39 6-57 30-52 72-31 8-54-9-67-50Z" opacity=".72"/>
      <path class="inkline" d="M367 170l66 160"/><path class="line" d="M333 188l33-18 18 34M433 330l-18-34 33-14"/>
      <circle class="paper" cx="126" cy="229" r="25"/><circle class="paper" cx="657" cy="126" r="17"/><circle class="paper" cx="620" cy="364" r="12"/>
      <path class="line" d="M400 85v330M235 250h330" opacity=".18"/>
    `,
    'roma-etki': `
      <path class="paper" d="M174 402V211c0-104 101-154 226-154s226 50 226 154v191h-91V223c0-61-59-91-135-91s-135 30-135 91v179h-91Z"/>
      <path class="dark" d="M249 402V226c0-73 68-110 151-110s151 37 151 110v176h-54V230c0-43-43-66-97-66s-97 23-97 66v172h-54Z" opacity=".47"/>
      <circle class="accent" cx="561" cy="149" r="72" opacity=".78"/>
      <circle class="bgcut" cx="561" cy="149" r="43"/><path class="line" d="M614 202l75 75" stroke-width="18"/>
      <path class="line" d="M108 402h584"/>
    `,
    'roma-hristiyanlik': `
      <path class="paper" d="M156 398V225c0-99 88-158 244-158s244 59 244 158v173h-88V238c0-62-56-94-156-94s-156 32-156 94v160h-88Z" opacity=".8"/>
      <path class="accent" d="M376 121h48v104h91v48h-91v132h-48V273h-91v-48h91V121Z"/>
      <path class="line" d="M130 398h540M400 64v353" opacity=".32"/>
      <path class="paper" d="M258 344c-58-35-85-83-82-145 52 14 91 47 116 98l-34 47Zm284 0c58-35 85-83 82-145-52 14-91 47-116 98l34 47Z" opacity=".33"/>
    `,
    'isa-tarihsellik': `
      <path class="line" d="M98 252h604"/><circle class="accent" cx="162" cy="252" r="18"/><circle class="paper" cx="400" cy="252" r="18"/><circle class="paper" cx="626" cy="252" r="18"/>
      <path class="line" d="M162 178v148M400 178v148M626 178v148" opacity=".45"/>
      <path class="paper" d="M103 105h118v57H103zM341 338h118v57H341zM567 105h118v57H567z"/>
      <path class="dark" d="M119 122h86v8h-86zm0 18h67v8h-67zm238 215h86v8h-86zm0 18h63v8h-63zm226-251h86v8h-86zm0 18h61v8h-61z" opacity=".56"/>
      <path class="accent" d="M248 244h66v16h-66zm238 0h66v16h-66z" opacity=".7"/>
      <path class="line" d="M248 229l-18 23 18 23M314 229l18 23-18 23M486 229l-18 23 18 23M552 229l18 23-18 23"/>
    `,
    'mit-ve-sicil': `
      <path class="paper" d="M136 89h245v324H136zM419 89h245v324H419z" opacity=".78"/>
      <path class="accent" d="M136 89h245v72H136zM419 341h245v72H419z"/>
      <path class="dark" d="M202 208c0-50 34-85 76-85s76 35 76 85c0 42-23 68-48 83v51h-56v-51c-25-15-48-41-48-83Z" opacity=".56"/>
      <path class="bgcut" d="M237 215c18-22 34-34 48-36 18 5 33 17 45 36-11 39-27 58-47 58-21 0-36-19-46-58Z" opacity=".45"/>
      <path class="inkline" d="M460 146h160M460 187h129M460 228h154M460 269h118"/>
      <path class="line" d="M400 72v358" stroke-dasharray="8 10"/>
    `
});
