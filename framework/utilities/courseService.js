import http from 'k6/http'
import { check } from 'k6'
import { Rate } from 'k6/metrics'

var failureRate = new Rate('FAILURE RATE');

let setHeader = () => {
    return {
        headers: {
            'Content-Type': 'application/json'
        }
    }
}

let getUnixTimestamp = () => {
    return Math.random().toString(36).substring(2, 7)
}

export function createCourse(endpoint, token) {
    let payload = {
        'wstoken': token,
        'moodlewsrestformat': 'json',
        'wsfunction': 'core_course_create_courses',
        'courses[0][fullname]': 'mycourses',
        'courses[0][shortname]': getUnixTimestamp(),
        'courses[0][categoryid]': 1,
        'courses[0][visible]': 1,
        'courses[0][summary]': 'text',
        'courses[0][enablecompletion]': 0,
        'courses[0][summaryformat]': 1,
        'courses[0][format]': 'topics',
        'courses[0][numsections]': 0
    }
    let response = http.post(endpoint, payload)
    let responseBody = JSON.parse(response.body)
    var checkCreateCourse = check(response, {
        'is status code for CREATE COURSE OPERATION is 200 OK': r => r.status === 200
    })
    failureRate.add(!checkCreateCourse)
    return responseBody[0].id
}

export function retrieveCourse(endpoint, token, id) {
    let url = `${endpoint}?wstoken=${token}&wsfunction=core_course_get_courses&options[ids][0]=${id}&moodlewsrestformat=json`
    let response = http.get(url, { headers: setHeader() });
    let checkRetrieveCourse = check(response, {
        'is status code for RETRIEVE COURSE OPERATION is 200 OK': r => r.status === 200
    })
    failureRate.add(!checkRetrieveCourse)
    return [checkRetrieveCourse, JSON.stringify(response.body)]
}

export function removeCourse(endpoint, token, id) {
    let url = `${endpoint}?wstoken=${token}&moodlewsrestformat=json&wsfunction=core_course_delete_courses&courseids[0]=${id}`
    let response = http.del(url, { headers: setHeader() });
    var checkRemoveCourse = check(response, {
        'is status code for REMOVE COURSE OPERATION is 200 OK': r => r.status === 200
    })
    failureRate.add(!checkRemoveCourse)
    return [checkRemoveCourse, JSON.stringify(response.body)]
}