import './main3.css'

export function Main3() {
    return (
        <div className='main3-container'>
            <div className='main3-part1'>
                <span> <i class="bi bi-bus-front-fill"></i></span>
                <p>Super Fast and Free Delivhery</p>
            </div>

            <div className='main3-part2'>
                <div className='part2-part1'>
                    <span className='part2-row'><i class="bi bi-credit-card-2-back-fill"></i></span>   <span className='para'>Non-contact shiping</span>
                </div>
                <div className='part2-part1'>
                    <span className='part2-row'><i class="bi bi-credit-card-2-back-fill"></i></span>   <span className='para'>Money-back Gauranteed</span>
                </div>
            </div>

            <div className='main3-part1'>
                <span><i class="bi bi-credit-card-2-back-fill"></i></span>
                <p>Super Secure Payment System</p>
            </div>
        </div>
    )
}