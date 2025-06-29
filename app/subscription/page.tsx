import { PricingTable } from "@clerk/nextjs"


const Subscription = () => {
  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen p-4 gap-8">
      <h1 className="text-3xl font-bold mb-6">Choose Your Learning Journey</h1>
      <p className="text-lg mb-8 text-center">Start free, upgrade anytime. Unlock smarter Conversations, deeper<br></br> insights, and unlimited potential with a plan that fits your goals.</p>
      {/* PricingTable component from Clerk */}
      {/* This will render the pricing table with available plans */}
      {/* Make sure to configure Clerk with your pricing plans in the dashboard */}
      <div className="w-full max-w-2/3 mx-auto">
        <PricingTable
          className="bg-white shadow-lg rounded-lg p-6"
         // Replace with your actual pricing table ID
          // You can pass additional props here if needed
        />
      </div>
      {/* The PricingTable component will handle the display of plans, pricing, and subscription management */}
      {/* Ensure you have set up Clerk with your pricing plans in the dashboard */}
      {/* You can customize the styles and layout as needed */}
      {/* For more customization options, refer to the Clerk documentation */}
      {/* https://clerk.com/docs/nextjs/pricing-table */}
      {/* You can also add additional information or links below the pricing table */}
      <p className="text-sm text-gray-500 mt-4">Need help? <a href="/support" className="text-blue-500 hover:underline">Contact Support</   a></p>
    </div>
  )
}

export default Subscription