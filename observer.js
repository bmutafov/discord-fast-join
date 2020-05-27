async function observe(server, channel) {
	console.clear();

	const maxClicks = 3;
	const timeoutClickMs = 50;
	const isLinkInvitation = link =>
		link?.href?.match(/^https:\/\/discord.gg\/[A-Za-z0-9]{2,10}$/);

	const target = document.querySelector('#messages');

	async function onMutation(mutations) {
		const rejoinTimeMs = 2000;

		try {
			const link = Array.from(target.querySelectorAll('[role="group"]'))
				.pop()
				.querySelector('a');

			if (!isLinkInvitation(link)) {
				// prettier-ignore
				feedbackMessage('Message with no invitation received.');
				return;
			}

			//prettier-ignore
			feedbackMessage(`<b>Invitation detected!</b> Attempting to join ${maxClicks} times.`);
			let counter = 0;
			async function click(link) {
				link.click();

				counter++;
				if (counter > maxClicks - 1) clearInterval(clicker);

				console.log(window.location.href, channel);
				setTimeout(async () => {
					if (window.location.href !== channel) {
						console.log('in');
						feedbackMessage(`Success!`);
						feedbackMessage(
							`Rejoining server in ${
								rejoinTimeMs / 1000
							} seconds...`
						);

						feedbackMessage(`Rejoined: ${server}`);
						document
							.querySelector(`[aria-label="${server}"]`)
							.click();
						observer.disconnect();

						await observe(server);
					}
				}, rejoinTimeMs);
			}

			await click(link);
			const clicker = setInterval(
				async () => await click(link),
				timeoutClickMs
			);
		} catch (e) {
			feedbackMessage(
				`Something went wrong. Please restart. <br /><i>${e}</i>`,
				true
			);
		}
	}

	const observer = new MutationObserver(onMutation);

	const config = {
		attributes: true,
		childList: true,
		characterData: true,
	};

	observer.observe(target, config);
	feedbackMessage('Attached observer to chat. Waiting for messages...');
}

module.exports = observe;
