import React, {useState} from 'react';
import {loadStripe} from '@stripe/stripe-js';
import {Elements, useStripe, useElements, CardElement} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY!);

interface PaymentComponentProps {
    userId: number;
    eventId: number;
    price: number;
    payWhatYouWant: boolean;
    confirmPayment: (amount: number) => Promise<void>;
}

const PaymentComponent = ({eventId, price, payWhatYouWant, userId, confirmPayment}: PaymentComponentProps) => {
    const [amount, setAmount] = useState(price);
    const [error, setError] = useState('');
    const stripe = useStripe();
    const elements = useElements();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (value >= price) {
            setAmount(value);
            setError('');
        } else {
            setError(`Amount must be at least £${price}`);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        if (!cardElement) {
            return;
        }

        const {error, paymentMethod} = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error(error);
            setError(error.message || 'An error occurred');
            return;
        }

        // Make API call to create payment intent
        const response = await fetch('http://localhost:5001/create-payment-intent', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({amount, userId, eventId, paymentMethodId: paymentMethod.id}),
        });

        const paymentIntent = await response.json();

        const {error: confirmError} = await stripe.confirmCardPayment(paymentIntent.clientSecret);

        if (confirmError) {
            console.error(confirmError);
            setError(confirmError.message || 'An error occurred');
            return;
        }
        await confirmPayment(amount);
        alert('Payment successful!');
    };

    return (
        <form onSubmit={handleSubmit}>
            {payWhatYouWant && (
                <div className="mb-4">
                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                        Enter amount (minimum £{price})
                    </label>
                    <input
                        type="number"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        min={price}
                        step="0.01"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                </div>
            )}
            <CardElement className="mb-4"/>
            <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                disabled={!stripe || amount < price}
            >
                Pay £{amount}
            </button>
        </form>
    );
};

export const EventPayment = (props: PaymentComponentProps) => (
    <Elements stripe={stripePromise}>
        <PaymentComponent {...props} />
    </Elements>
);