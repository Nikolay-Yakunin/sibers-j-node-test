const { NewUser } = require('../model');
const {describe, expect, test} = require('@jest/globals')

describe("NewUser",
  test("Valid data: Max username, min pass, ", () => {
    expect(NewUser(
      "AaBbCcDdEeFfGgHhIiJjKkLlMmN1234567890-_",
      "cqX3]c3jl8'y",
      "ДжонJosh",
      "ДжоновJoshv",
      "01.01.2000"
    )).toBe()
  })
)