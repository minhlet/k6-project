// 1. Import necessary packages
import { VUS, DURATION, ENDPOINT, UAT_TOKEN } from '../test-data/test-data.js'
import { createCourse, retrieveCourse, removeCourse } from '../utilities/courseService.js'

// 2. Export options
export let options = {
    vus: VUS,
    duration: DURATION
}

// 3. Init environment
export default function () {
    // Main flow: Create course > Retrieve course > Remove course
    // 1. Create new course and return courseId
    let courseId = createCourse(ENDPOINT, UAT_TOKEN)
    console.log(`New course created successfully - ${courseId}`)

    // 2. Retrieve newly created course
    console.log(`Endpoint used - ${ENDPOINT}; UAT Token - ${UAT_TOKEN}; Course ID - ${courseId}`)
    let retrieveResponse = retrieveCourse(ENDPOINT, UAT_TOKEN, courseId)
    if (retrieveResponse[0]) {
        console.log(`Course is retrived successfully - ${retrieveResponse[1]}`)
    }

    // 3. Remove successfully
    let removeResponse = removeCourse(ENDPOINT, UAT_TOKEN, courseId)
    if (removeResponse[0]) {
        console.log(`Course is removed successfully - ${removeResponse[1]}`)
    }
}