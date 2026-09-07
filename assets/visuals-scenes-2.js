window.ITVisualScenes=Object.assign(window.ITVisualScenes||{}, {
    'stonehenge': `
      <path class="line" d="M72 371c113-108 230-173 350-196 102-20 203-9 306 31" opacity=".48"/>
      <path class="accent" d="M84 378c160-25 283-8 369 50H84v-50Z" opacity=".5"/>
      <path class="paper" d="M184 185h72v193h-72zM293 151h76v227h-76zM416 160h78v218h-78zM543 197h72v181h-72zM167 145h218v54H167zM400 120h232v55H400z"/>
      <path class="dark" d="M207 185h20v193h-20zm110-34h22v227h-22zm124 9h22v218h-22zm124 37h21v181h-21z" opacity=".32"/>
      <circle class="accent" cx="115" cy="343" r="14"/><path class="line" d="M115 343c58-14 96-36 130-72" stroke-dasharray="9 10"/>
    `,
    'sumer': `
      <path class="paper" d="M235 76h330c30 0 55 25 55 55v264c0 30-25 55-55 55H235c-30 0-55-25-55-55V131c0-30 25-55 55-55Z"/>
      <path class="accent" d="M235 76h330c30 0 55 25 55 55v264c0 30-25 55-55 55H235c-30 0-55-25-55-55V131c0-30 25-55 55-55Z" opacity=".19"/>
      <g class="dark" opacity=".68">
        <path d="M260 143l38 10-32 12Zm78-9 41 15-39 8Zm96 11 37 8-34 14Zm75-3 38 13-38 9ZM260 204l35 12-35 8Zm79 1 44 10-39 12Zm100-4 31 14-33 7Zm69 6 40 9-36 11ZM261 270l42 9-38 14Zm89-5 32 15-36 8Zm83 8 40 8-36 13Zm76-6 35 14-37 8ZM263 335l37 12-40 7Zm82 5 42 8-39 14Zm95-3 33 13-36 8Zm70 6 39 9-36 12Z"/>
      </g>
      <path class="line" d="M213 119h374M213 184h374M213 249h374M213 314h374M213 379h374" opacity=".25"/>
    `,
    'angkor': `
      <path class="line" d="M81 88h638v330H81zM129 88v330m72-330v330m72-330v330m72-330v330m72-330v330m72-330v330m72-330v330m72-330v330M81 142h638M81 196h638M81 250h638M81 304h638M81 358h638" opacity=".25"/>
      <path class="accent" d="M102 339c108-35 189-24 243 33 45 47 106 46 183-2 59-37 116-39 170-5v53H102v-79Z" opacity=".55"/>
      <path class="paper" d="M238 339V218h64v121h-64Zm101 0V161h122v178H339Zm159 0V218h64v121h-64Z"/>
      <path class="paper" d="M354 161l46-77 46 77h-92Zm-108 57 24-49 24 49h-48Zm260 0 24-49 24 49h-48Z"/>
      <path class="dark" d="M378 245h44v94h-44zM258 273h24v66h-24zm260 0h24v66h-24z" opacity=".6"/>
      <circle class="accent" cx="400" cy="84" r="12"/>
    `,
    'tas-tepeler': `
      <path class="line" d="M74 92h652v330H74zM139 92v330m65-330v330m65-330v330m65-330v330m65-330v330m65-330v330m65-330v330m65-330v330m65-330v330M74 147h652M74 202h652M74 257h652M74 312h652M74 367h652" opacity=".21"/>
      <path class="paper" d="M207 132h143v55h-44v205h-55V187h-44v-55Zm243 45h143v55h-44v160h-55V232h-44v-55Z"/>
      <path class="accent" d="M100 370h109v52H100z"/><text x="154" y="406" text-anchor="middle" font-family="ui-monospace,monospace" font-size="30" font-weight="800" fill="var(--art-ink)">5%</text>
      <path class="dark" d="M251 187h55v205h-55zm243 45h55v160h-55z" opacity=".22"/>
    `,
    'machu-picchu': `
      <circle class="accent" cx="605" cy="109" r="58" opacity=".82"/>
      <path class="paper" d="M58 379 244 139l91 116 97-152 112 165 62-77 136 188H58Z" opacity=".2"/>
      <path class="line" d="M58 379 244 139l91 116 97-152 112 165 62-77 136 188"/>
      <path class="accent" d="M154 321h492v38H154zM188 277h421v35H188zM227 235h338v33H227zM272 197h248v29H272z"/>
      <path class="paper" d="M310 165h178v137H310z"/>
      <path class="dark" d="M332 192h42v110h-42zm69 0h42v110h-42zm64 0h23v110h-23z" opacity=".52"/>
      <path class="line" d="M136 396h529" opacity=".45"/>
    `,
    'chichen-itza': `
      <path class="paper" d="M216 364h368v45H216zM251 319h298v45H251zM286 274h228v45H286zM321 229h158v45H321zM355 184h90v45h-90z"/>
      <path class="dark" d="M390 184h20v225h-20z" opacity=".4"/>
      <path class="accent" d="M369 134h62l22 50H347l22-50Z"/>
      <path class="line" d="M447 147c77 16 133 63 170 141M459 115c105 18 183 81 230 189M353 147c-77 16-133 63-170 141M341 115c-105 18-183 81-230 189" opacity=".65"/>
      <circle class="accent" cx="666" cy="105" r="11"/><path class="line" d="M666 53v104M614 105h104M629 68l74 74M703 68l-74 74" opacity=".42"/>
    `,
    'kapadokya': `
      <path class="paper" d="M0 317c85-28 138-17 208 17 78 38 144 30 223-2 83-34 156-37 234-7 49 19 94 27 135 23v152H0V317Z" opacity=".24"/>
      <path class="paper" d="M169 330 223 138l53 192H169Zm169 0 68-253 68 253H338Zm202 0 47-172 48 172h-95Z"/>
      <path class="accent" d="M196 138h55l-28-67-27 67Zm177-61h66l-33-69-33 69Zm190 81h48l-24-54-24 54Z"/>
      <path class="dark" d="M207 245h32v85h-32zm180-94h38v179h-38zm185 95h30v84h-30z" opacity=".56"/>
      <path class="line" d="M94 368h612M124 401h552M172 434h455" opacity=".55"/><circle class="accent" cx="320" cy="401" r="9"/><circle class="accent" cx="501" cy="434" r="9"/>
    `
});
