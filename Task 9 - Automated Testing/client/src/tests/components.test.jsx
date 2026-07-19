import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import Button from '../components/Button';
import ErrorMessage from '../components/ErrorMessage';
import EmptyState from '../components/EmptyState';
import Toast from '../components/Toast';

describe('Brew Haven Frontend Component Tests', () => {
    // Test 1: Button renders children text
    it('Button renders child content correctly', () => {
        render(<Button>Click Me</Button>);
        expect(screen.getByText('Click Me')).toBeInTheDocument();
    });

    // Test 2: Button triggers onClick handler
    it('Button triggers onClick callback when clicked', () => {
        const handleClick = vi.fn();
        render(<Button onClick={handleClick}>Click Me</Button>);
        const btnElement = screen.getByText('Click Me');
        fireEvent.click(btnElement);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    // Test 3: ErrorMessage renders with custom error text
    it('ErrorMessage renders error text message', () => {
        const errorText = 'Test Connection Interrupted';
        render(<ErrorMessage message={errorText} />);
        expect(screen.getByText(errorText)).toBeInTheDocument();
    });

    // Test 4: EmptyState renders fallback title and description
    it('EmptyState renders title and subtitle properties', () => {
        render(
            <EmptyState
                icon="🥤"
                title="No Beverages Available"
                description="Check back later."
            />
        );
        expect(screen.getByText('🥤')).toBeInTheDocument();
        expect(screen.getByText('No Beverages Available')).toBeInTheDocument();
        expect(screen.getByText('Check back later.')).toBeInTheDocument();
    });

    // Test 5: Toast renders message and can be manually dismissed
    it('Toast renders message text and executes onClose callback when dismissed', () => {
        const handleClose = vi.fn();
        render(
            <Toast
                message="Operation completed successfully"
                type="success"
                onClose={handleClose}
            />
        );
        expect(screen.getByText('Operation completed successfully')).toBeInTheDocument();

        const closeBtn = screen.getByLabelText('Dismiss notification');
        fireEvent.click(closeBtn);
        expect(handleClose).toHaveBeenCalledTimes(1);
    });
});
