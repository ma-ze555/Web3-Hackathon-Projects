module squid_chain_starter::starter_lock {
    use aptos_framework::timestamp;
    use std::signer;

    const E_ALREADY_INITIALIZED: u64 = 1;
    const E_NOT_OWNER: u64 = 2;
    const E_LOCKED: u64 = 3;
    const E_INVALID_AMOUNT: u64 = 4;
    const E_INVALID_DELAY: u64 = 5;
    const E_NOT_INITIALIZED: u64 = 6;
    const E_ALREADY_RELEASED: u64 = 7;

    struct Lock has key {
        owner: address,
        beneficiary: address,
        amount: u64,
        unlock_at_seconds: u64,
        released: bool,
        withdrawn_amount: u64,
    }

    public entry fun initialize(
        owner: &signer,
        beneficiary: address,
        amount: u64,
        unlock_after_seconds: u64,
    ) acquires Lock {
        let owner_address = signer::address_of(owner);
        assert!(!exists<Lock>(owner_address), E_ALREADY_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);
        assert!(unlock_after_seconds > 0, E_INVALID_DELAY);

        move_to(
            owner,
            Lock {
                owner: owner_address,
                beneficiary,
                amount,
                unlock_at_seconds: timestamp::now_seconds() + unlock_after_seconds,
                released: false,
                withdrawn_amount: 0,
            },
        );
    }

    public entry fun add_to_lock(owner: &signer, amount: u64) acquires Lock {
        let owner_address = signer::address_of(owner);
        assert!(exists<Lock>(owner_address), E_NOT_INITIALIZED);
        assert!(amount > 0, E_INVALID_AMOUNT);

        let lock = borrow_global_mut<Lock>(owner_address);
        assert!(lock.owner == owner_address, E_NOT_OWNER);
        assert!(!lock.released, E_ALREADY_RELEASED);
        lock.amount = lock.amount + amount;
    }

    public entry fun release(owner: &signer) acquires Lock {
        let owner_address = signer::address_of(owner);
        assert!(exists<Lock>(owner_address), E_NOT_INITIALIZED);

        let lock = borrow_global_mut<Lock>(owner_address);
        assert!(lock.owner == owner_address, E_NOT_OWNER);
        assert!(!lock.released, E_ALREADY_RELEASED);
        assert!(timestamp::now_seconds() >= lock.unlock_at_seconds, E_LOCKED);

        lock.withdrawn_amount = lock.amount;
        lock.amount = 0;
        lock.released = true;
    }

    public fun lock_exists(owner: address): bool {
        exists<Lock>(owner)
    }

    public fun get_lock(owner: address): (address, address, u64, u64, bool, u64) acquires Lock {
        let lock = borrow_global<Lock>(owner);
        (
            lock.owner,
            lock.beneficiary,
            lock.amount,
            lock.unlock_at_seconds,
            lock.released,
            lock.withdrawn_amount,
        )
    }
}
