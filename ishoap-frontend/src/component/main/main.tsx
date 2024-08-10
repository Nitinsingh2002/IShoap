import { MainPartOne } from '../main1/part1'
import { Main2 } from '../main2/main2'
import { Main3 } from '../main3/main3'
import { Main4 } from '../main4/main4'

import './main.css'

export function Main() {
    return (
        <>
            <div className="mainDiv">
                <MainPartOne />
                <Main2 />
                <Main3 />
                <Main4 />
            </div>
        </>
    )
}