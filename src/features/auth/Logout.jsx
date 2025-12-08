logoutButton.addEventListener('click', async () => {
             try {
                await signOut(auth);
                showModal('Signed Out', 'You have successfully signed out.');
            } catch (error) {
                showModal('Error', 'Failed to sign out. Please try again.');
            }
        });
