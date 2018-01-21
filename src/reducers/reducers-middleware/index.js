export const createReducer = (name, type, initialState) => {
  switch (type) {
    case 'literal':
      return (state = initialState, action) => {

        if (action.type === name && checkConditions(action)) {
          switch (action.operation) {
            case 'set':
              return fetchValue(action, 'value')
            default:
              return state
          }
        } else return state
      }

    case 'literal-array':
      return (state = initialState, action) => {
        if (action.type === name && checkConditions(action)) {
          switch (action.operation) {
            case 'set':
              return fetchValue(action, 'value')
            case 'append':
              return appendValue(state, action)
            case 'prepend':
              return prependValue(state, action)
            case 'removeByValue':
              return removeByValue(state, action)
            case 'removeByIndex':
              return removeByIndex(state, action)

            default:
              return state
          }
        } else return state
      }

    case 'object':
      return (state = initialState, action) => {
        if (action.type === name && checkConditions(action)) {

          switch (action.operation) {
            case 'set':
              return fetchValue(action, 'value')

            default:
              return state
          }
        } else return state
      }

    case 'object-array':
      return (state = initialState, action) => {
        if (action.type === name && checkConditions(action)) {
          switch (action.operation) {
            case 'set':
              return fetchValue(action)
            case 'append':
              return appendValue(state, action)
            case 'prepend':
              return prependValue(state, action)
            case 'removeByKey':
              return removeByKey(state, action)
            case 'removeByIndex':
              return removeByIndex(state, action)

            default:
              return state
          }
        } else return state
      }

    default:
      break;
  }

}

// Returns obj[key]
// If obj[key] is some address within obj, it fetches value from that address
// Examples:
// 1. obj = { value: 3 }, key = 'value' return 3
// 2. obj = { value: 'data.ack', data: { ack: true } }, key = 'value' return true

const fetchValue = function (obj, key) {
  return (typeof obj[key] === 'string' && obj[key].includes('.')) ? loadValue(obj, obj[key].split('.')) : obj[key]
}

const appendValue = function (state, action) {
  let value = fetchValue(action, 'value')
  let nextState = state.slice()
  nextState.push(value)
  return nextState
}

const prependValue = function (state, action) {
  let value = fetchValue(action, 'value')
  let nextState = state.slice()
  nextState.unshift(value)
  return nextState
}

const removeByValue = function (state, action) {
  let value = fetchValue(action, 'value')
  let nextState = state.slice()
  nextState.splice(nextState.indexOf(value), 1)
  return nextState
}

const removeByIndex = function (state, action) {
  let nextState = state.slice()
  nextState.splice(action.index, 1)
  return nextState
}

const removeByKey = function (state, action) {
  let nextState = state.slice()
  const index = nextState.findIndex((obj) => { return obj[action.key] === action.value })
  if (index !== -1) {
    nextState.splice(index, 1)
  }
  return nextState
}

// Loads value from a object
const loadValue = function (obj, keys) {
  return keys.reduce((prev, curr) => { return prev[curr] }, obj)
}

const checkConditions = function (action) {
  let result = true
  if (action.conditions) {
    action.conditions.forEach(condition => {
      let operand1 = (typeof condition.operand1 === 'string' && condition.operand1.includes('.')) ? loadValue(action, condition.operand1.split('.')) : condition.operand1
      let operand2 = (typeof condition.operand2 === 'string' && condition.operand2.includes('.')) ? fetchValue(action, condition.operand2.split('.')) : condition.operand2
      if (!checkCondition(condition.operator, operand1, operand2)) result = false
    })
  }
  return result
}

const checkCondition = function (operator, operator1, operator2) {

  if (operator === undefined || operator === null) return false
  switch (operator) {
    case '===': return operator1 === operator2
    case '!==': return operator1 !== operator2
    case '>=': return operator1 >= operator2
    case '<=': return operator1 <= operator2
    case '>': return operator1 > operator2
    case '<': return operator1 < operator2
    default:
      console.log('Check condition failed - got wrong operator: ', operator)
      return false
  }
}
  
export const initReducerMiddleware = (config) => {
  return store => next => action => {
    let actions = config[action.type]
    if (actions) {
      actions.forEach(obj => next(Object.assign({}, obj, { data: action.data })))
    }
    return next(action);
  }
}