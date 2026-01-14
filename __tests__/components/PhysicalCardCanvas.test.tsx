/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { PhysicalCardCanvas } from '../../presentation/components/PhysicalCardCanvas';
import { PhysicalCardSide } from '../../domain/entities/Card';

// Mock resize observer if needed
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

describe('PhysicalCardCanvas', () => {
    const mockConfig: PhysicalCardSide = {
        elements: [
            { id: 'e1', type: 'name', content: 'Test Name', x: 10, y: 10, isVisible: true, fontSize: 12, color: '#000' },
            { id: 'e2', type: 'title', content: 'Test Title', x: 10, y: 30, isVisible: true, fontSize: 10, color: '#333' }
        ],
        backgroundColor: '#ffffff'
    };

    const mockOnChange = jest.fn();

    it('renders without crashing and displays elements', () => {
        render(
            <PhysicalCardCanvas 
                side="front"
                config={mockConfig}
                onChange={mockOnChange}
            />
        );

        expect(screen.getByText('Test Name')).toBeInTheDocument();
        expect(screen.getByText('Test Title')).toBeInTheDocument();
        expect(screen.getByText('正面 (90x54mm)')).toBeInTheDocument();
    });

    it('selects an element on click and shows controls', () => {
        render(
            <PhysicalCardCanvas 
                side="front"
                config={mockConfig}
                onChange={mockOnChange}
            />
        );

        const nameElement = screen.getByText('Test Name');
        fireEvent.click(nameElement);

        // Controls should appear
        expect(screen.getByText('A+')).toBeInTheDocument();
        expect(screen.getByText('Center')).toBeInTheDocument();
    });

    it('does not show grid in readOnly mode', () => {
         render(
            <PhysicalCardCanvas 
                side="front"
                config={mockConfig}
                onChange={mockOnChange}
                readOnly={true}
            />
        );

        // Grid checkbox label "顯示格線" should not be present
        expect(screen.queryByText('顯示格線')).not.toBeInTheDocument();
    });
});
