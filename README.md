<p align="center">
  <a href="https://www.glueprotocol.com/" rel="noopener" target="_blank"><img width="135" src="public/glue-icon.png" alt="Glue protocol logo"></a>
</p>

<h1 align="center">Glue Protocol Interface</h1>

<div align="center">

An open source interface for Glue - a protocol for efficiently and privately trading between assets on the Solana blockchain

[Website](https://glueprotocol.vercel.app/) •
[Twitter](https://twitter.com/dimos851)

[Motivation](#motivation) •
[Inspiration](#inspiration) •
[Use cases](#use-cases) •
[Integrations](#on-the-shoulders-of-giants) •
[Get involved](#get-involved)

</div>

![Glue GIF Demo](https://dp-pet-images.s3.eu-west-2.amazonaws.com/glue-demo.gif)

## Motivation

Make it easy for users to trade between different assets.

## What's New

Using [Elusiv's SDK](https://elusiv-privacy.github.io/elusiv-sdk/) Glue now supports private payments!

[Try it out](https://glueprotocol.vercel.app/)

## Inspiration

[This blog post by Vitalik](https://vitalik.eth.limo/general/2022/12/05/excited.html)

## Use cases

- John holds $USDC but Alice wants to get paid in $BONK. Using Glue, John can instantly convert and pay Alice in the asset of her choice.
- John wants to pay Alice but he does not know her address. He can create a payment link and share it with Alice through email, social media or a text message - it's just a URL that contains tokens!
- John wants to pay Alice `privately` without revealing his address. He can create a private balance, fund it and pay Alice through that.
- Alice wants to get paid so she creates a "Request Payment" link, specifying the asset she wants to receive and her address. Alice sends it to John who can pay her using his preferred token. _(coming soon)_

## On the shoulders of giants

Leveraging tech built by projects in the Solana ecosystem.

- [Elusiv](https://elusiv.io/) - using Elusiv's SDK to enable private payments
- [Jupiter](https://docs.jup.ag/) - using Jupiter's built-in swap transactions and token APIs
- [Bonfida](https://bonfida.github.io/solana-name-service-guide/introduction.html) - mapping .sol domain names to SOL addresses
- [Solana Mobile Stack](https://github.com/solana-mobile/mobile-wallet-adapter) - interacting with wallets on Android using the Mobile Wallet Adapter
- [Droplinks](https://droplinks.io/docs/v1) - loading SPL tokens in links to power payment URLs

## Get involved

Contributions are welcome! If you think a killer feature is missing or something can be done better, go ahead and file Issues, open Pull Requests, or join me on [Twitter](https://twitter.com/dimos851) to discuss any feedback.
