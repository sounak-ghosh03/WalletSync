import React, { useContext, useState } from "react";

const BASE_URL = "https://walletsync-qf4o.onrender.com/";

const GlobalContext = React.createContext();

export const GlobalProvider = ({ children }) => {
    const [incomes, setIncomes] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [error, setError] = useState(null);

    // Calculate incomes
    const addIncome = async (income) => {
        try {
            const response = await fetch(`${BASE_URL}add-income`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(income),
            });

            if (!response.ok) {
                throw new Error("Failed to add income");
            }

            await getIncomes();
        } catch (err) {
            setError(err.message);
        }
    };

    const getIncomes = async () => {
        try {
            const response = await fetch(`${BASE_URL}get-incomes`);
            const data = await response.json();
            setIncomes(Array.isArray(data) ? data : []);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch incomes", err);
            setIncomes([]);
        }
    };

    const deleteIncome = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}delete-income/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete income");
            }

            await getIncomes();
        } catch (err) {
            console.error("Failed to delete income", err);
        }
    };

    const totalIncome = () => {
        let total = 0;
        if (Array.isArray(incomes)) {
            incomes.forEach((income) => {
                total += income.amount;
            });
        } else {
            console.error("incomes is not an array:", incomes);
        }
        return total;
    };

    // Calculate expenses
    const addExpense = async (expense) => {
        try {
            const response = await fetch(`${BASE_URL}add-expense`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(expense),
            });

            if (!response.ok) {
                throw new Error("Failed to add expense");
            }

            await getExpenses();
        } catch (err) {
            setError(err.message);
        }
    };

    const getExpenses = async () => {
        try {
            const response = await fetch(`${BASE_URL}get-expenses`);
            const data = await response.json();
            setExpenses(Array.isArray(data) ? data : []);
            console.log(data);
        } catch (err) {
            console.error("Failed to fetch expenses", err);
            setExpenses([]);
        }
    };

    const deleteExpense = async (id) => {
        try {
            const response = await fetch(`${BASE_URL}delete-expense/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("Failed to delete expense");
            }

            await getExpenses();
        } catch (err) {
            console.error("Failed to delete expense", err);
        }
    };

    const totalExpenses = () => {
        let total = 0;
        if (Array.isArray(expenses)) {
            expenses.forEach((expense) => {
                total += expense.amount;
            });
        } else {
            console.error("expenses is not an array:", expenses);
        }
        return total;
    };

    const totalBalance = () => {
        return totalIncome() - totalExpenses();
    };

    const transactionHistory = () => {
        const history = [...incomes, ...expenses];
        history.sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

        return history.slice(0, 3);
    };

    return (
        <GlobalContext.Provider
            value={{
                addIncome,
                getIncomes,
                incomes,
                deleteIncome,
                expenses,
                totalIncome,
                addExpense,
                getExpenses,
                deleteExpense,
                totalExpenses,
                totalBalance,
                transactionHistory,
                error,
                setError,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = () => {
    return useContext(GlobalContext);
};
