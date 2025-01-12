import { Replace } from "@/helpers";
import { IdProvider } from "@domain/protocols/providers";
import { User } from "./user";

export type HashingAlgorithmProps = {
    name: string;
    createdAt: Date;
    updatedAt: Date;
};

export type HashingAlgorithmPropsCreate = Replace<
    HashingAlgorithmProps,
    {
        createdAt?: Date;
        updatedAt?: Date;
    }
>;

export type HashingAlgorithmProviders = {
    idProvider?: IdProvider;
};

export type HashingAlgorithmCreationParams = {
    props: HashingAlgorithmPropsCreate;
    idProvider?: IdProvider;
    id?: string;
};

export class HashingAlgorithm implements HashingAlgorithmProps {
    private _id: string;
    private props: HashingAlgorithmProps;

    private constructor(
        props: HashingAlgorithmPropsCreate,
        providers: HashingAlgorithmProviders,
        id?: string
    ) {
        this._id = id || providers.idProvider!.generate();
        const date = User.getCurrentDateWithGmt();

        this.props = {
            ...props,
            createdAt: props.createdAt ?? date,
            updatedAt: props.updatedAt ?? date,
        };
    }

    static async create(
        params: HashingAlgorithmCreationParams
    ): Promise<HashingAlgorithm> {
        const { props, idProvider, id } = params;
        return new HashingAlgorithm(props, { idProvider }, id);
    }

    get id(): string {
        return this._id;
    }
    get name(): string {
        return this.props.name;
    }
    get createdAt(): Date {
        return this.props.createdAt;
    }
    get updatedAt(): Date {
        return this.props.updatedAt;
    }
}
