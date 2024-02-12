const useLocalStorage = () => {
    const getItem = (itemName) => {
        if (!itemName) {
            return
        }
        let itemFound = localStorage.getItem(itemName)
        if (!itemFound) {
            return null
        }
        try {
            let parsedItem = JSON.parse(itemFound)
            return parsedItem
        } catch (error) {
            console.log(error)
            return error.message
        }
    }
    const deleteItem = (itemName) => {
        if (!itemName) {
            return
        }
        localStorage.removeItem(itemName)
    }
    const removeAll = () => {
        localStorage.clear()
    }
    return { getItem, deleteItem, removeAll }
}

export default useLocalStorage