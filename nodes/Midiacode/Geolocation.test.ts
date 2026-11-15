/* eslint-disable @typescript-eslint/no-explicit-any */
import { INodeProperties } from 'n8n-workflow';

import { CALENDAR_DATE_EXPRESSION, Midiacode } from './Midiacode.node';

const properties = new Midiacode().description.properties;

const findProperty = (name: string, operation: string): INodeProperties | undefined =>
    properties.find(
        (p: INodeProperties) =>
            p.name === name &&
            (p.displayOptions?.show?.operation as string[] | undefined)?.includes(operation),
    );

const operation = (value: string) =>
    properties
        .find(
            (p: INodeProperties) =>
                p.name === 'operation' &&
                (p.displayOptions?.show?.resource as string[] | undefined)?.includes('content'),
        )
        ?.options?.find((o: any) => o.value === value) as any;

describe('Set Geolocation', () => {
    it('puts to the content geo endpoint', () => {
        const op = operation('setGeolocation');
        expect(op?.routing?.request?.method).toBe('PUT');
        expect(op?.routing?.request?.url).toBe('=/public/content/{{$parameter.contentId}}/geo/');
    });

    it.each([
        ['latitude', 'lat'],
        ['longitude', 'lng'],
        ['distance', 'distance'],
    ])('sends required %s as body %s', (name, bodyProperty) => {
        const property = findProperty(name, 'setGeolocation');
        expect(property?.required).toBe(true);
        expect(property?.routing?.send?.type).toBe('body');
        expect(property?.routing?.send?.property).toBe(bodyProperty);
    });

    it('limits the distance to 10-1000 m with a 200 m default', () => {
        const distance = findProperty('distance', 'setGeolocation');
        expect(distance?.default).toBe(200);
        expect(distance?.typeOptions).toMatchObject({ minValue: 10, maxValue: 1000 });
    });

    it.each([
        ['startDate', 'start_date'],
        ['endDate', 'end_date'],
    ])('sends optional %s as a calendar date in body %s', (name, bodyProperty) => {
        const property = findProperty(name, 'setGeolocation');
        expect(property?.required).toBeFalsy();
        expect(property?.type).toBe('dateTime');
        expect(property?.routing?.send?.property).toBe(bodyProperty);
        expect(property?.routing?.send?.value).toBe(CALENDAR_DATE_EXPRESSION);
    });

    it('reuses content id (path) and workspace id (body)', () => {
        expect(findProperty('contentId', 'setGeolocation')).toBeDefined();
        expect(findProperty('workspaceIdBody', 'setGeolocation')?.routing?.send?.property).toBe(
            'workspace_id',
        );
    });
});

describe('CALENDAR_DATE_EXPRESSION', () => {
    it('keeps only the date part of the n8n dateTime value', () => {
        expect(CALENDAR_DATE_EXPRESSION).toBe(
            '={{ $value ? String($value).slice(0, 10) : undefined }}',
        );
    });
});

describe('Remove Geolocation', () => {
    it('deletes the content geo with workspace id in the query string', () => {
        const op = operation('removeGeolocation');
        expect(op?.routing?.request?.method).toBe('DELETE');
        expect(op?.routing?.request?.url).toBe('=/public/content/{{$parameter.contentId}}/geo/');
        expect(findProperty('contentId', 'removeGeolocation')).toBeDefined();
        const workspace = findProperty('workspaceIdQuery', 'removeGeolocation');
        expect(workspace?.routing?.send?.type).toBe('query');
        expect(workspace?.routing?.send?.property).toBe('workspace_id');
        expect(findProperty('workspaceIdBody', 'removeGeolocation')).toBeUndefined();
    });
});
